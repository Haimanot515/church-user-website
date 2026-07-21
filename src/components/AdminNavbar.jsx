import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";

const AdminNavbar = () => {
  const [openMenu, setOpenMenu] = useState(null);

  const navbarStyle = {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#020c1cff",
    padding: "12px 20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    borderRadius: "10px",
  };

  const ulStyle = {
    listStyle: "none",
    margin: 0,
    padding: 0,
  };

  const liStyle = {
    position: "relative",
  };

  const spanStyle = {
    cursor: "pointer",
    color: "#f1f5f9",
    fontWeight: "600",
    padding: "8px 14px",
    borderRadius: "6px",
    transition: "background 0.3s",
  };

  const dropdownStyle = {
    position: "absolute",
    top: "110%",
    left: 0,
    backgroundColor: "#fff",
    minWidth: "200px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    borderRadius: "8px",
    zIndex: 100,
    overflow: "hidden",
  };

  const linkStyle = {
    display: "block",
    padding: "10px 15px",
    textDecoration: "none",
    color: "#1e293b",
    fontWeight: "500",
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", margin: "20px", color: "#1e293b" }}>
        Admin Panel
      </h1>

      <nav style={navbarStyle}>
        {/* LANDING SECTION */}
        <ul style={ulStyle}>
          <li
            style={liStyle}
            onMouseEnter={() => setOpenMenu("landing")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <span style={spanStyle}>Landing</span>
            {openMenu === "landing" && (
              <ul style={dropdownStyle}>
                <li><Link style={linkStyle} to="/admin/landing/manage">Manage Landing</Link></li>
              </ul>
            )}
          </li>
        </ul>

        {/* UPDATED: HOME HERO SECTION */}
        <ul style={ulStyle}>
          <li
            style={liStyle}
            onMouseEnter={() => setOpenMenu("homehero")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <span style={spanStyle}>Home Hero</span>

            {openMenu === "homehero" && (
              <ul style={dropdownStyle}>
                <li><Link style={linkStyle} to="/admin/hero/create">Create Home Hero</Link></li>
                <li><Link style={linkStyle} to="/admin/hero/view">View Home Hero</Link></li>
                <li><Link style={linkStyle} to="/admin/hero/update">Update Home Hero</Link></li>
                <li><Link style={linkStyle} to="/admin/hero/delete">Delete Home Hero</Link></li>
              </ul>
            )}
          </li>
        </ul>

        {/* USERS */}
        <ul style={ulStyle}>
          <li
            style={liStyle}
            onMouseEnter={() => setOpenMenu("users")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <span style={spanStyle}>Users</span>

            {openMenu === "users" && (
              <ul style={dropdownStyle}>
                <li><Link style={linkStyle} to="/admin/users/view">View Users</Link></li>
                <li><Link style={linkStyle} to="/admin/users/update">Update Users</Link></li>
                <li><Link style={linkStyle} to="/admin/users/delete">Delete Users</Link></li>
              </ul>
            )}
          </li>
        </ul>

        {/* PROJECTS */}
        <ul style={ulStyle}>
          <li
            style={liStyle}
            onMouseEnter={() => setOpenMenu("projects")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <span style={spanStyle}>Projects</span>

            {openMenu === "projects" && (
              <ul style={dropdownStyle}>
                <li><Link style={linkStyle} to="/admin/projects/create">Create Project</Link></li>
                <li><Link style={linkStyle} to="/admin/projects/view">View Projects</Link></li>
                <li><Link style={linkStyle} to="/admin/projects/update">Update Projects</Link></li>
                <li><Link style={linkStyle} to="/admin/projects/delete">Delete Projects</Link></li>
              </ul>
            )}
          </li>
        </ul>

        {/* CONTACTS */}
        <ul style={ulStyle}>
          <li
            style={liStyle}
            onMouseEnter={() => setOpenMenu("contacts")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <span style={spanStyle}>Contacts</span>

            {openMenu === "contacts" && (
              <ul style={dropdownStyle}>
                <li><Link style={linkStyle} to="/admin/contacts/view">View Messages</Link></li>
                <li><Link style={linkStyle} to="/admin/contacts/reply">Reply Messages</Link></li>
                <li><Link style={linkStyle} to="/admin/contacts/delete">Delete Messages</Link></li>
              </ul>
            )}
          </li>
        </ul>

        {/* SKILLS */}
        <ul style={ulStyle}>
          <li
            style={liStyle}
            onMouseEnter={() => setOpenMenu("skills")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <span style={spanStyle}>Skills</span>

            {openMenu === "skills" && (
              <ul style={dropdownStyle}>
                <li><Link style={linkStyle} to="/admin/skills/create">Add Skill</Link></li>
                <li><Link style={linkStyle} to="/admin/skills/view">View Skills</Link></li>
                <li><Link style={linkStyle} to="/admin/skills/update">Update Skills</Link></li>
                <li><Link style={linkStyle} to="/admin/skills/delete">Delete Skills</Link></li>
              </ul>
            )}
          </li>
        </ul>

        {/* ABOUT */}
        <ul style={ulStyle}>
          <li
            style={liStyle}
            onMouseEnter={() => setOpenMenu("about")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <span style={spanStyle}>About</span>

            {openMenu === "about" && (
              <ul style={dropdownStyle}>
                <li><Link style={linkStyle} to="/admin/about/create">Create About</Link></li>
                <li><Link style={linkStyle} to="/admin/about/view">View About</Link></li>
                <li><Link style={linkStyle} to="/admin/about/update">Update About</Link></li>
              </ul>
            )}
          </li>
        </ul>
      </nav>

      <Outlet />
    </div>
  );
};

export default AdminNavbar;