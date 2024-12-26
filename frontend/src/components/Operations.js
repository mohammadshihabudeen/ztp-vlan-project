import React, { useState } from 'react';
import { createVlans } from '../services/api';
import SwitchList from './SwitchList';
import VlanForm from './VlanForm';

const Operations = () => {
    const [selectedSwitch, setSelectedSwitch] = useState(null);
    const [message, setMessage] = useState('');

    const handleSwitchSelect = (sw) => {
        setSelectedSwitch(sw);
        setMessage('');
    };

    const handleVlanSubmit = async (vlans) => {
        try {
            const response = await createVlans(selectedSwitch.id, vlans);
            setMessage(response.message);
        } catch (error) {
            setMessage('Error creating VLANs.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-6 text-center w-3/4 md:w-1/2">
                {/* Combined Title and Operations */}
                <h1 className="text-3xl font-bold text-gray-800 mb-2">ZTP VLAN Automation Tools</h1>
                <h2 className="text-xl font-semibold text-gray-600 mb-6">Switch Operations</h2>

                {/* Switch List or VLAN Form */}
                {!selectedSwitch ? (
                    <SwitchList onSelect={handleSwitchSelect} />
                ) : (
                    <>
                        <h3 className="text-lg font-medium text-gray-700">Selected Switch: {selectedSwitch.ip}</h3>
                        <VlanForm onSubmit={handleVlanSubmit} />
                    </>
                )}
                {message && <p className="mt-4 text-gray-600">{message}</p>}
            </div>
        </div>
    );
};

export default Operations;
