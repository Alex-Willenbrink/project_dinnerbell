import React from "react";
import Avatar from "material-ui/Avatar";
import { List, ListItem } from "material-ui/List";
import Paper from "material-ui/Paper";
import { Link } from "react-router-dom";

const UsersList = ({ users, title }) => (
  <Paper zDepth={4} style={{ borderRadius: "25px" }}>
    <h3
      style={{
        textAlign: "center",
        margin: 0,
        paddingTop: "10px",
        textDecoration: "underline"
      }}
    >
      {title}
    </h3>
    <List>
      {users.map(user => (
        <Link
          to={`/profile/${user._id}`}
          key={user._id}
          style={{ textDecoration: "none" }}
        >
          <ListItem
            primaryText={user.username}
            leftAvatar={<Avatar src={user.profilePicture} />}
          />
        </Link>
      ))}
    </List>
  </Paper>
);

export default UsersList;
