import React, { useState } from "react";
import { createVlans } from "../services/api";
import SwitchList from "./SwitchList";
import VlanForm from "./VlanForm";

const Operations = () => {
    const [selectedSwitch, setSelectedSwitch] = useState(null);
    const [message, setMessage] = useState('');

  const handleSwitchSelect = (sw) => {
    setSelectedSwitch(sw);
    setMessage("");
    setCreatedVlans([]); // Reset created VLANs on switch change
  };

  const handleVlanSubmit = async (vlans) => {
    setLoading(true); // Set loading to true
    setMessage("VLANs creation in process...");

    // Start countdown timer
    let seconds = 0;
    const countdown = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
      seconds += 1;
    }, 1000);

    try {
      const response = await createVlans(selectedSwitch.id, vlans);

      if (response.success) {
        // Extract VLAN names from the response message
        const vlanNames = response.message
          .match(/name': '(.*?)'/g)
          .map((vlan) => vlan.replace(/name': '(.*?)'/, "$1"));
        setCreatedVlans(vlanNames); // Store names of created VLANs
        setMessage("VLANs created successfully!");
      } else {
        setMessage("Error creating VLANs.");
      }
    } catch (error) {
      setMessage("Error creating VLANs.");
    } finally {
      clearInterval(countdown); // Clear countdown timer after process is finished
      setLoading(false); // Set loading to false
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 text-center w-3/4 md:w-1/2">
        {/* Combined Title and Operations */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          ZTP VLAN Automation Tool
        </h1>
        <h2 className="text-xl font-semibold text-gray-600 mb-6">
          Switch Operations
        </h2>

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
