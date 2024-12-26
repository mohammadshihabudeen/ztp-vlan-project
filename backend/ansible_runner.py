import paramiko
import os
 
def run_ansible_playbook(extra_vars):
    print(f"Running Ansible Playbook with extra vars: {extra_vars}")
    host = "192.168.40.128"
    username = "vicky"
    password = "vicky"
    playbook_path_local = r"D:/automation/ztp-vlan-project/backend/create_vlan.yml"
    inventory_path_local = r"D:/automation/ztp-vlan-project/backend/inventory.ini"
 
    remote_playbook_path = "/tmp/create_vlan.yml"
    remote_inventory_path = "/tmp/inventory.ini"
   
    try:
        # Initialize SSH client
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(host, username=username, password=password)
       
        # Initialize SFTP client to copy files
        sftp = ssh.open_sftp()
        sftp.put(playbook_path_local, remote_playbook_path)
        sftp.put(inventory_path_local, remote_inventory_path)
        sftp.close()
 
        # Combine commands into a single execution
        ansible_command = (
            f"cd ansible_masterclass && "
            f"source ~/py_venv/venv_ansible_latest/bin/activate && "
            f"ansible-playbook {remote_playbook_path} -i {remote_inventory_path} "
            f"--extra-vars '{extra_vars}'"
        )
       
        # Execute the command
        stdin, stdout, stderr = ssh.exec_command(ansible_command)
 
        output = stdout.read().decode().strip()
        error = stderr.read().decode().strip()
 
        ssh.close()
 
        if error:
            print(f"Error: {error}")
            return {"success": False, "error": error}
        print(f"Output: {output}")
        return {"success": True, "output": output}
   
    except Exception as e:
        print(f"Exception occurred: {e}")
        return {"success": False, "error": str(e)}
 