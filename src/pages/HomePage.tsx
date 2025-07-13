import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Card from '../components/ui/Card';

const HomePage: React.FC = () => {

    return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Church Committee Administration</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <Link to="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
        </Card>
        <Card className="p-4">
          <Link to="/members" className="text-blue-600 hover:underline">Members</Link>
        </Card>
        <Card className="p-4">
          <Link to="/finance" className="text-blue-600 hover:underline">Finance</Link>
        </Card>
        <Card className="p-4">
          <Link to="/education" className="text-blue-600 hover:underline">Education</Link>
        </Card>
        <Card className="p-4">
          <Link to="/reports" className="text-blue-600 hover:underline">Reports</Link>
        </Card>
      </div>
    </div>
  );

}

export default HomePage;