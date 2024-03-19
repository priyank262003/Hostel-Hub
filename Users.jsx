import React, { useState, useEffect } from "react";
import Admin from "../Admin_Page/Admin";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./Users.module.css"; // Import the CSS module

const Users = ({}) => {
  axios.defaults.baseURL = "http://localhost:8080/";
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(4);

  const getUsers = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllUsers");
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    }
  };

  const deleteUser = async (userId) => {
    try {
      const res = await axios.delete("/api/v1/admin/delete/" + userId);
      if (res.data.success) {
        toast.success(res.data.message);
        getUsers();
      }
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const jumpToPage = (pageNumber) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= Math.ceil(users.length / usersPerPage)
    ) {
      setCurrentPage(pageNumber);
    }
  };

  // Generate an array of page numbers
  const pageNumbers = Array.from(
    { length: Math.ceil(users.length / usersPerPage) },
    (_, i) => i + 1
  );

  return (
    <>
      <Admin>
        <div className={styles.user_container}>
          <table className={styles["users-table"]}>
            <thead>
              <tr>
                <th>UserName</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0 ? styles["even-row"] : styles["odd-row"]
                  }
                >
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td className={styles.status}>
                    <button className={styles.activeButton}>Active</button>
                    <button
                      className={styles.actionButton}
                      onClick={() => deleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className={styles.pagination}>
            <button
              onClick={() => jumpToPage(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <select
              value={currentPage}
              onChange={(e) => jumpToPage(parseInt(e.target.value))}
            >
              {pageNumbers.map((pageNumber) => (
                <option key={pageNumber} value={pageNumber}>
                  {pageNumber}
                </option>
              ))}
            </select>
            <button
              onClick={() =>
                jumpToPage(
                  currentPage < Math.ceil(users.length / usersPerPage)
                    ? currentPage + 1
                    : Math.ceil(users.length / usersPerPage)
                )
              }
              disabled={currentPage === Math.ceil(users.length / usersPerPage)}
            >
              Next
            </button>
          </div>
        </div>
      </Admin>
    </>
  );
};

export default Users;
