from flask import Blueprint, request, jsonify
from ansible_runner import run_ansible_playbook

blueprint = Blueprint('api', __name__)

# Mock switches for the frontend to use
switches = [
    {"id": "switch1", "ip": "192.168.1.1"},
    {"id": "switch2", "ip": "192.168.1.2"},
]

@blueprint.route('/switches', methods=['GET'])
def get_switches():
    return jsonify(switches)

@blueprint.route('/create_vlans', methods=['POST'])
def create_vlan():
    try:
        # Get VLAN data from the request
        data = request.json
        vlans = data.get('vlans')
        switch_id = data.get('switchId')

        if not vlans:
            return jsonify({"success": False, "error": "VLAN data is required"}), 400

        # Convert VLAN data to Ansible extra-vars format
        extra_vars = {"vlans": vlans}
        
        # Run the Ansible playbook
        result = run_ansible_playbook(extra_vars)

        if result["success"]:
            return jsonify({"success": True, "message": result["output"]})
        else:
            return jsonify({"success": False, "error": result["error"]}), 500
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
