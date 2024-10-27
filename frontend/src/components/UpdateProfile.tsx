import React, {useState, useEffect} from "react";

interface User{
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_active: boolean;
}

interface UserUpdateWidgetProps{
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

const UpdateProfileWidget: React.FC<UserUpdateWidgetProps> = ({user, onClose, onSave})=>{
  const [first_name, setFirstName] = useState(user.first_name);
  const [last_name, setLastName] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [is_active, setIsActive] = useState(user.is_active);
  const [cur_password, setCurPassword] = useState('');
  const [new_password, setNewPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  
  const handleSave = () =>{
    onSave({...user, first_name: first_name, last_name: last_name, email: email, role:role, is_active: is_active})
    onClose();
  }
  return(
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center text-blue-950">
      <div className="bg-white p-8 rounded-lg shadow-lg w-1/2 max-w-lg">
        <h2 className="text-xl font-bold mb-4">Update User</h2>

        <label className="block mb-2">First Name:</label>
        <input
          type="text"
          className="border w-full p-2 mb-4"
          value={first_name}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <label className="block mb-2">Last Name:</label>
        <input
          type="text"
          className="border w-full p-2 mb-4"
          value={last_name}
          onChange={(e) => setLastName(e.target.value)}
        />

        <label className="block mb-2">Email:</label>
        <input
          type="email"
          className="border w-full p-2 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />       

        <label className="block mb-2">Password:</label>
        <input
          type="password"
          className="border w-full p-2 mb-4"
          value={cur_password}
          onChange={(e) => setCurPassword(e.target.value)}
          placeholder="Current Password"
        />

        <label className="block mb-2">Password:</label>
        <input
          type="password"
          className="border w-full p-2 mb-4"
          value={new_password}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Current Password"
        />

        <label className="block mb-2">Password:</label>
        <input
          type="password"
          className="border w-full p-2 mb-4"
          value={confirm_password}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Current Password"
        />

        <div className="flex justify-end">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 mr-2 rounded">Cancel</button>
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        </div>
      </div>
    </div>
  );

};

export default UpdateProfileWidget;

