# 👟 SoleDistrict (DTP E-Commerce)

![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)

> **Modern E-Commerce Platform for Sneakerheads.** > Built with **Laravel 11** (Backend API) and **React + Vite** (Frontend).

---

## 📂 Project Structure (Monorepo)

Project ini menggunakan struktur **Monorepo**. Backend dan Frontend berada dalam satu repository.

```text
/ (Root)              -> 🧠 BACKEND (Laravel Framework)
├── app/              -> Logika API & Controller
├── database/         -> Migrations & Seeders
├── routes/api.php    -> Definisi Endpoint API
└── frontend/         -> 🎨 FRONTEND (React Application)
    ├── src/          -> Halaman & Komponen React
    └── package.json  -> Dependencies Frontend