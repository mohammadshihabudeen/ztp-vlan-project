from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os
app = Flask(__name__)
CORS(app)

# Example switches (can be fetched from Supabase in real setup)
switches = [
    {"id": "switch1", "ip": "192.168.1.1"},
    {"id": "switch2", "ip": "192.168.1.2"},
]

@app.route('/switches', methods=['GET'])
def get_switches():
    return jsonify(switches)

@app.route('/create_vlans', methods=['POST'])
def create_vlans():
    data = request.json
    switch_id = data.get('switchId')
    vlans = data.get('vlans')
    print(vlans)

    inventory_path = os.path.join(os.getcwd(), 'inventory.ini')
    playbook_path = os.path.join(os.getcwd(), 'playbook/create_vlan.yml')

    # Generate the VLAN config variables
    extra_vars = {"vlans": vlans}
    try:
        result = subprocess.run(
            [
                "ansible-playbook",
                playbook_path,
                "-i", inventory_path,
                "--extra-vars", f"{extra_vars}"
            ],
            capture_output=True,
            text=True,
            shell=True
        )

        if result.returncode == 0:
            return jsonify({"message": "VLANs created successfully!"})
        else:
            return jsonify({"message": "Failed to create VLANs.", "error": result.stderr}), 400
    except Exception as e:
        return jsonify({"message": "An error occurred.", "error": str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True)
