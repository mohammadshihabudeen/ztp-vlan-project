import paramiko

def run_ansible_playbook(extra_vars):
    host = "your_ubuntu_vm_ip"
    username = "your_ubuntu_username"
    password = "your_ubuntu_password"
    playbook_path = "/path/to/create_vlan.yml"
    inventory_path = "/path/to/inventory.ini"

    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(host, username=username, password=password)

        # Prepare the Ansible command
        ansible_command = (
            f"ansible-playbook {playbook_path} -i {inventory_path} "
            f"--extra-vars '{extra_vars}'"
        )
        stdin, stdout, stderr = ssh.exec_command(ansible_command)

        output = stdout.read().decode()
        error = stderr.read().decode()

        ssh.close()

        if error:
            return {"success": False, "error": error}
        return {"success": True, "output": output}
    except Exception as e:
        return {"success": False, "error": str(e)}
