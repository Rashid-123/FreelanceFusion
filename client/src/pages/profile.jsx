import { useState, useEffect } from "react";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEdit } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAvatarTouched, setIsAvatarTouched] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState([]);
  const [contact, setContact] = useState("");
  const [editMode, setEditMode] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser);
  const userId = currentUser?.id;
  const token = currentUser?.token;
  const skillsOptions = [
    { value: "web development", label: "Web Development" },
    { value: "mobile app development", label: "Mobile App Development" },
    { value: "graphic design", label: "Graphic Design" },
    { value: "digital marketing", label: "Digital Marketing" },
    { value: "content writing", label: "Content Writing" },
    { value: "data entry", label: "Data Entry" },
    { value: "customer support", label: "Customer Support" },
    { value: "sales", label: "Sales" },
    { value: "accounting", label: "Accounting" },
    { value: "video production", label: "Video Production" },
    { value: "photography", label: "Photography" },
  ];

  useEffect(() => {
    setIsLoading(true);
    const getUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/${userId}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const userData = response.data;
        setName(userData.name);
        setBio(userData.bio);
        setSkills(
          userData.skills.map((skill) => ({ value: skill, label: skill }))
        );
        setContact(userData.contact);
        setAvatar(userData.avatarURL);
        setIsLoading(false);
      } catch (error) {
        console.log("Error in fetching user data", error);
      }
    };

    getUser();
  }, [userId, token]);

  const updateUserDetails = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userData = new FormData();
      userData.set("name", name);
      userData.set("contact", contact);
      userData.set("bio", bio);

      const skillsArray = skills.map((skill) => skill.value);
      userData.set("skills", JSON.stringify(skillsArray));

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/updateUser/${userId}`,
        userData,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        setEditMode(false);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const changeAvatarHandler = async () => {
    setIsAvatarTouched(false);
    try {
      const postData = new FormData();
      postData.append("avatar", avatar);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/change_Avatar`,
        postData,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      setAvatar(response.data.avatarURL);
    } catch (error) {
      console.log("Error in changing avatar", error);
    }
  };

  const handleSkillsChange = (selectedOptions) => {
    setSkills(selectedOptions);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  // Custom styles for react-select component
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#007bff" : provided.borderColor,
      boxShadow: state.isFocused ? "0 0 0 1px #007bff" : provided.boxShadow,
      "&:hover": {
        borderColor: state.isFocused ? "#007bff" : provided.borderColor,
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#f0f0f0" : "#fff",
      color: state.isFocused ? "#000" : "#000",
      "&:active": {
        backgroundColor: "#007bff",
        color: "#000",
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#e0e0e0",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "white",
      backgroundColor: "#3b0b41",
      padding: "5px 15px",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#333",
      "&:hover": {
        backgroundColor: "#007bff",
        color: "#fff",
      },
    }),
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <section className="profile_container container">
      <div className="avatar__wrapper">
        <div className="profile__avatar">
          <img src={avatar} alt="Profile Avatar" />
        </div>
        <form className="avatar__form">
          <input
            type="file"
            name="avatar"
            id="avatar"
            accept="image/png, image/jpg, image/jpeg"
            onChange={(e) => setAvatar(e.target.files[0])}
          />
          <label htmlFor="avatar" onClick={() => setIsAvatarTouched(true)}>
            <FontAwesomeIcon icon={faEdit} style={{ color: "#2563eb" }} />
          </label>
        </form>
        {isAvatarTouched && (
          <button className="profile__avatar-btn" onClick={changeAvatarHandler}>
            <FontAwesomeIcon icon={faCheck} />
          </button>
        )}
      </div>
      <h2>{name}</h2>
      <form action="" onSubmit={updateUserDetails} className="user_form">
        {!editMode && (
          <button type="button" onClick={toggleEditMode} className="edit_btn">
            Edit
          </button>
        )}
        {editMode && (
          <button type="submit" className="save_btn">
            Save
          </button>
        )}
        <div className="user_info">
          <div className="property">
            <label className="form-label">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className={editMode ? "enabled" : "disabled"}
              disabled={!editMode}
            />
          </div>
          <div className="property">
            <label className="form-label">Contact</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Contact"
              className={editMode ? "enabled" : "disabled"}
              disabled={!editMode}
            />
          </div>
          <div className="property">
            <label className="form-label">Bio</label>
            <textarea
              rows={4}
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Bio"
              className={editMode ? "enabled" : "disabled"}
              disabled={!editMode}
            />
          </div>
          <div>
            <label className="form-label">Skills</label>
            <Select
              isMulti
              name="skills"
              options={skillsOptions}
              className="basic-multi-select"
              classNamePrefix="select"
              value={skills}
              onChange={handleSkillsChange}
              placeholder="Select Skills"
              isDisabled={!editMode} // Disable Select when not in edit mode
              styles={customStyles} // Apply custom styles
            />
          </div>
        </div>
      </form>
    </section>
  );
};

export default Profile;
