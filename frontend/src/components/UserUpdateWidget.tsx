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

const UserUpdateWidget: React.FC<UserUpdateWidgetProps> = ({user, onClose, onSave})=>{
  const [first_name, setFirstName] = useState(user.first_name);
  const [last_name, setLastName] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [password, setPassword] = useState('');
  const [activeopt, setActiveOpt] = useState(user.is_active ? 'active': 'no_active');
  const [is_active, setIsActive] = useState(user.is_active);

  const handleActiveChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const {value} = event.target;
    setActiveOpt(value);
    if(value === 'active'){
      setIsActive(true);
    }
    else{
      setIsActive(false);
    }
  }
  
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

        <label className="block mb-2">Role:</label>
        <input
          type="text"
          className="border w-full p-2 mb-4"
          value="user"
          onChange={(e) => setRole(e.target.value)}
          readOnly
        />
        
        
        <label className="block mb-2">Active:</label>
        <select
          id="active"
          name="active"
          value={activeopt}
          onChange={handleActiveChange}
          className="border p-2 rounded w-full"
        >
          <option value="active">Yes</option>
          <option value="no_active">No</option>
        </select>

        <label className="block mb-2">Password:</label>
        <input
          type="password"
          className="border w-full p-2 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password if changing"
        />

        <div className="flex justify-end">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 mr-2 rounded">Cancel</button>
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        </div>
      </div>
    </div>
  );

};

export default UserUpdateWidget;

