import { Inngest } from "inngest";
import User from "../config/models/user.js";

// Create client
export const inngest = new Inngest({ id: "movie-ticket-booking" });


// USER CREATE
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };

    await User.create(userData);
  }
);


// USER DELETE
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await User.findByIdAndDelete(id);
  }
);


// USER UPDATE
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },   // FIXED ID
  { event: "clerk/user.updated" },    // FIXED EVENT NAME
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };

    await User.findByIdAndUpdate(id, userData);
  }
);


// EXPORT
export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
];
