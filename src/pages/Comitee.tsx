const Committee = () => {
  const committeeMembers = [
    { id: 1, name: "Abraham Tesfaye", role: "Chairman", phone: "123-456-7890" },
    { id: 2, name: "Ruth Gideon", role: "Finance Head", phone: "321-654-0987" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Committee Members</h2>
      <ul className="space-y-2">
        {committeeMembers.map((member) => (
          <li key={member.id} className="bg-white p-4 rounded shadow">
            <div className="font-semibold">{member.name}</div>
            <div className="text-sm text-gray-600">{member.role}</div>
            <div className="text-sm text-gray-600">{member.phone}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Committee;
