import React, { useState } from "react";
import Admin from "../Admin_Page/Admin";
import styles from "./HostelForm.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const HostelForm = () => {
  const navigate = useNavigate();

  const [numRooms, setNumRooms] = useState(0);
  const [roomData, setRoomData] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [numberofRooms, setNumberOfRooms] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleNumRoomsChange = (e) => {
    const count = parseInt(e.target.value);
    if (count >= 0 && count < 3) {
      setNumRooms(count);
      const data = Array.from({ length: count }, () => ({
        category: "",
        price: "",
      }));
      setRoomData(data);
    } else {
      console.log("Invalid number of rooms");
    }
  };

  const handleCategoryChange = (index, value) => {
    const updatedRoomData = [...roomData];
    updatedRoomData[index].category = value;
    setRoomData(updatedRoomData);
  };

  const handlePriceChange = (index, value) => {
    const updatedRoomData = [...roomData];
    updatedRoomData[index].price = value;
    setRoomData(updatedRoomData);
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  axios.defaults.baseURL = "http://localhost:8080/";

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("address", address);
      formData.append("contact", contact);
      formData.append("email", email);
      formData.append("description", description);
      formData.append("numRooms", numRooms);
      formData.append("numberofRooms", numberofRooms);
      formData.append("roomData", JSON.stringify(roomData));
      formData.append("image", imageFile);

      const res = await axios.post("/api/v1/admin/createHostelForm", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // rooms exists or not
      if (res.data.exists) {
        toast.warning("Hostel Already Exists");
      } else {
        if (res.data.success) {
          toast.success(res.data.message);
          navigate("/admin");
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Problem sending the message");
    }
  };

  return (
    <Admin>
      <div className={styles.hostel_container}>
        <div className={styles.hostel_form}>
          <input
            type="text"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name of the hostel"
          />
          <input
            type="text"
            className={styles.input}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address Location"
          />
          <input
            type="text"
            className={styles.input}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Contact Information"
          />
          <input
            type="text"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Information"
          />

          <textarea
            className={styles.input}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief Description"
          />
          <input
            type="number"
            value={numberofRooms}
            className={styles.input}
            onChange={(e) => setNumberOfRooms(e.target.value)}
            placeholder="Number of Rooms"
          />
          <input
            type="number"
            className={styles.input}
            onChange={handleNumRoomsChange}
            placeholder="Types of Rooms"
          />

          <div className={styles.room_row}>
            {roomData.map((room, index) => (
              <div key={index} className={styles.room_input}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder={`Room Category ${index + 1}`}
                  value={room.category}
                  onChange={(e) => handleCategoryChange(index, e.target.value)}
                />
                <input
                  type="number"
                  className={styles.input}
                  placeholder={`Room Price ${index + 1} in rupees`}
                  value={room.price}
                  onChange={(e) => handlePriceChange(index, e.target.value)}
                />
              </div>
            ))}
            <input
              type="file"
              className={styles.input}
              placeholder="Image"
              onChange={handleImageChange}
            />
            <button type="submit" className={styles.btn} onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </Admin>
  );
};

export default HostelForm;
