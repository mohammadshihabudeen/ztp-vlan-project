import json

import paramiko


def run_ansible_playbook(extra_vars):
    print(f"Running Ansible Playbook with extra vars: {extra_vars}")

    # Remote host details (intermediate host)
    remote_host = "192.168.0.108"  # Remote laptop IP
    remote_username = "mohan"      # Remote laptop username
    remote_password = "mohan"      # Remote laptop password

    # Ubuntu host details (target host)
    ubuntu_host = "192.168.17.128"  # Ubuntu machine IP
    ubuntu_username = "mohan"       # Ubuntu username
    ubuntu_password = "123"         # Ubuntu password

    # GitHub repository details
    github_repo_url = "https://github.com/mohammadshihabudeen/playbooks.git"
    # repo_clone_path = "/tmp/ansible_repo"  # Path on the Ubuntu machine where the repo will be cloned

    try:
        # Step 1: Connect to the remote laptop (intermediate host)
        ssh_remote = paramiko.SSHClient()
        ssh_remote.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh_remote.connect(remote_host, username=remote_username, password=remote_password)
        print(f"Connected to remote host: {remote_host}")

        # Step 2: Initialize SSH connection to Ubuntu from the remote host
        transport = ssh_remote.get_transport()
        dest_addr = (ubuntu_host, 22)
        local_addr = (remote_host, 22)
        channel = transport.open_channel("direct-tcpip", dest_addr, local_addr)

        ssh_ubuntu = paramiko.SSHClient()
        ssh_ubuntu.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh_ubuntu.connect(ubuntu_host, username=ubuntu_username, password=ubuntu_password, sock=channel)
        print(f"Connected to Ubuntu host: {ubuntu_host}")

        # Step 3: Clone or update the GitHub repository
        git_clone_command = (
            f"rm -rf playbooks && "
            f"git clone {github_repo_url} "
        )
        stdin, stdout, stderr = ssh_ubuntu.exec_command(git_clone_command)
        clone_output = stdout.read().decode().strip()
        clone_error = stderr.read().decode().strip()
        print(f"Clone Output: {clone_output}")
        print(f"Clone Error: {clone_error}")

        # Step 4: Verify the playbook path
        playbook_path = f"playbooks/create_vlan.yml"
        inventory_path = f"playbooks/inventory.ini"

        # Ensure the playbook file exists
        verify_playbook_command = f"ls {playbook_path}"
        stdin, stdout, stderr = ssh_ubuntu.exec_command(verify_playbook_command)
        verify_output = stdout.read().decode().strip()
        verify_error = stderr.read().decode().strip()
        if verify_error:
            print(f"Error verifying playbook: {verify_error}")
            return {"success": False, "error": f"Playbook not found at {playbook_path}"}
        print(f"Playbook verified at {playbook_path}")

        # Step 5: Execute the Ansible playbook on the Ubuntu machine
        extra_vars_json = json.dumps(extra_vars)
        ansible_command = (
            f"source /home/mohan/vir_env/virtualenv_ansible/bin/activate && "
            f"ansible-playbook {playbook_path} -i {inventory_path} -e '{extra_vars_json}'"
        )
        stdin, stdout, stderr = ssh_ubuntu.exec_command(ansible_command)

        # Capture output and error
        output = stdout.read().decode().strip()
        error = stderr.read().decode().strip()

        # Close SSH sessions
        ssh_ubuntu.close()
        ssh_remote.close()

        if "To ensure idempotency" in error:
            print("Warning suppressed: idempotency issue detected")
            error = ""  # Treat this as a success, clearing the error message

        if error:
            print(f"Error: {error}")
            return {"success": False, "error": error}

        print(f"Output: {output}")
        return {"success": True, "output": output}

    except Exception as e:
        print(f"Exception occurred: {e}")
        return {"success": False, "error": str(e)}


# Example usage
if __name__ == "__main__":
    extra_vars = {
        "vlans": [{"vlan_id": "300", "name": "haiiii"}]
    }
    result = run_ansible_playbook(extra_vars)
    print(result)
