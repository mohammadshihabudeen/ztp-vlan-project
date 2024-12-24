from flask import Blueprint, request, jsonify
from app.ansible_runner import run_ansible_playbook

blueprint = Blueprint('api', __name__)

@blueprint.route('/create-vlan', methods=['POST'])
def create_vlan():
    try:
        # Get VLAN data from the request
        data = request.json
        vlans = data.get('vlans')
        
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
