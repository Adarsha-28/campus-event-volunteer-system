import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import "./../styles/ManageUsers.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getDocs(collection(db, "users")).then(snap => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const toggleStatus = async (u) => {
    await updateDoc(doc(db, "users", u.id), { active: !u.active });
    setUsers(users.map(x => x.id === u.id ? { ...x, active: !x.active } : x));
  };

  const promote = async (id) => {
    await updateDoc(doc(db, "users", id), { role: "organizer" });
    setUsers(users.map(u => u.id === id ? { ...u, role: "organizer" } : u));
  };

  const remove = async (id) => {
    if (!window.confirm("Delete permanently?")) return;
    await deleteDoc(doc(db, "users", id));
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="manage-users">
      <h1>User & Organizer Management</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.active ? "Active" : "Inactive"}</td>
              <td>
                <button onClick={() => toggleStatus(u)}>Toggle</button>
                {u.role === "user" && <button onClick={() => promote(u.id)}>Promote</button>}
                <button className="danger" onClick={() => remove(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
