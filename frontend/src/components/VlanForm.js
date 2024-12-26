import React, { useState } from 'react';

const VlanForm = ({ onSubmit }) => {
    const [vlans, setVlans] = useState([{ vlan_id: '', name: '' }]);

    // Add a new VLAN field
    const addVlan = () => {
        setVlans([...vlans, { vlan_id: '', name: '' }]);
    };

    // Handle changes in VLAN inputs
    const handleChange = (index, key, value) => {
        const updatedVlans = [...vlans];
        updatedVlans[index][key] = value;
        setVlans(updatedVlans);
    };

    // Submit the VLANs
    const handleSubmit = () => {
        if (vlans.some((vlan) => vlan.vlan_id === '' || vlan.name === '')) {
            alert('Please fill out all VLAN fields before submitting.');
            return;
        }
        onSubmit(vlans);
    };

    return (
        <div className="bg-gray-100 p-6 rounded-md shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Create VLANs</h3>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                {vlans.map((vlan, index) => (
                    <div key={index} className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                        <input
                            type="number"
                            placeholder="VLAN ID"
                            value={vlan.vlan_id}
                            onChange={(e) => handleChange(index, 'vlan_id', e.target.value)}
                            className="w-full md:w-1/3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="VLAN Name"
                            value={vlan.name}
                            onChange={(e) => handleChange(index, 'name', e.target.value)}
                            className="w-full md:w-2/3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                ))}
                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={addVlan}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                    >
                        Add VLAN
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        Create VLANs
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VlanForm;
