import React, { useState } from 'react';

const VlanForm = ({ onSubmit }) => {
    const [vlans, setVlans] = useState([{ vlan_id: '', name: '' }]);

    const addVlan = () => {
        setVlans([...vlans, { vlan_id: '', name: '' }]);
    };

    const handleChange = (index, key, value) => {
        const updatedVlans = [...vlans];
        updatedVlans[index][key] = value;
        setVlans(updatedVlans);
    };

    const handleSubmit = () => {
        onSubmit(vlans);
    };

    return (
        <div>
            <h3>Create VLANs</h3>
            {vlans.map((vlan, index) => (
                <div key={index}>
                    <input
                        type="number"
                        placeholder="VLAN ID"
                        value={vlan.vlan_id}
                        onChange={(e) => handleChange(index, 'vlan_id', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="VLAN Name"
                        value={vlan.name}
                        onChange={(e) => handleChange(index, 'name', e.target.value)}
                    />
                </div>
            ))}
            <button onClick={addVlan}>Add VLAN</button>
            <button onClick={handleSubmit}>Create VLANs</button>
        </div>
    );
};

export default VlanForm;
