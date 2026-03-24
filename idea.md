# PromptVault – AI Prompt Sharing Platform

## 1. Project Overview

PromptVault is a web-based social platform where users can create, share, discover, and save AI prompts. 
It works like a lightweight social media platform specifically designed for AI prompt creators.

The platform allows users to:
- Post AI prompts
- Like and bookmark prompts
- Follow other creators
- View trending prompts
- Manage personal profiles

The goal is to design a scalable and structured backend using MERN Stack with TypeScript while applying system design principles.

---

## 2. Scope of the Project

This project will include:

- User Authentication (JWT-based)
- Prompt Creation & Management
- Social Interactions (Like, Follow, Save)
- Feed Generation
- Trending Section
- Notification System (basic)
- Pagination & Search

Not included (Out of scope for now):
- Real-time chat
- Payment features
- AI model integration
- Complex recommendation engine

---

## 3. Key Features

### User Features
- Register / Login
- Create Prompt
- Edit / Delete Prompt
- Like Prompt
- Save Prompt
- Follow / Unfollow User
- View Personal Profile
- View Followers / Following

### Feed Features
- Global Feed (latest prompts)
- Following Feed
- Trending Prompts (based on likes)

### System Features
- Role-based access (User/Admin)
- Rate limiting
- MongoDB indexing
- Pagination
- Secure authentication

---

## 4. Tech Stack

Frontend:
- React + TypeScript
- Axios
- Redux / Context API

Backend:
- Node.js
- Express.js
- TypeScript
- JWT Authentication

Database:
- MongoDB (Mongoose)

