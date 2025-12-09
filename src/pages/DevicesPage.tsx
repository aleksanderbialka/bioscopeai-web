import { DeviceList } from "../features/devices/components/devices/DeviceList";

function DevicesPage() {
  const handleDeviceSelect = (deviceId: string) => {
    // Możesz nawigować do szczegółów urządzenia
    console.log("Selected device:", deviceId);
    // navigate(`/devices/${deviceId}`);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Devices</h1>
        <p className="text-gray-600">Manage your edge devices</p>
      </div>

      <DeviceList onDeviceSelect={handleDeviceSelect} />
    </div>
  );
}

export default DevicesPage;
