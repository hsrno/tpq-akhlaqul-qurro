// assets/data/jadwal.js
const JADWAL_DATA = {
  materi: [
    {
      no: 1,
      mapel: "Baca Tulis Al-Qur'an / Iqro",
      pengajar: "Kak Inang, Asst. Pengajar (Tutor)",
    },
    {
      no: 2,
      mapel: "Tahsin Surah",
      pengajar: "Kak Inang, Asst. Pengajar (Tutor)",
    },
    { no: 3, mapel: "Fiqih", pengajar: "Kak Inang" },
    { no: 4, mapel: "Aqidah Akhlak & Akhlaqul Karim", pengajar: "Kak Inang" },
    {
      no: 5,
      mapel: "Hadist (Setoran Hadist Pendek)",
      pengajar: "Asst. Pengajar (Tutor)",
    },
    { no: 6, mapel: "Hadist Arba'in", pengajar: "Kak Inang" },
    { no: 7, mapel: "Doa Harian (Sugra)", pengajar: "Asst. Pengajar (Tutor)" },
    { no: 8, mapel: "Zikir dan Doa (Kubra)", pengajar: "Kak Inang" },
    { no: 9, mapel: "Ilmu Tajwid", pengajar: "Kak Inang" },
    { no: 10, mapel: "Resume Kajian Pilihan", pengajar: "Kak Inang" },
    { no: 11, mapel: "Bedah Buku Pilihan", pengajar: "Kak Inang" },
    {
      no: 12,
      mapel: "Kesenian Islam",
      pengajar: "Kak Inang, Asst. Pengajar (Tutor)",
    },
  ],

  rutinitas: [
    { hari: "Senin", kegiatan: "Membaca Surah Yasin" },
    { hari: "Selasa", kegiatan: "Surah Al-Waqiah" },
    { hari: "Rabu", kegiatan: "Al-Mulk" },
    { hari: "Kamis", kegiatan: "Zikir Al Ma'tsurat" },
    { hari: "Jum'at", kegiatan: "Al Kahfi" },
    { hari: "Sabtu", kegiatan: "Review Hafalan" },
  ],

  semesterGenap: {
    "A Seluruhnya": {
      Senin: ["Membaca & Menulis Al-Qur'an", "Tahsin Surah"],
      Selasa: ["Membaca & Menulis Al-Qur'an", "Tahsin Surah"],
      Rabu: ["Membaca & Menulis Al-Qur'an", "Fiqih Solat"],
      Kamis: ["Membaca & Menulis Al-Qur'an", "Hadist"],
      Jumat: ["Aqidah Akhlaq/Adab", "Hafalan Do'a Harian", "Kesenian Islam"],
      Sabtu: [
        "Praktik Solat/Wudhu/Tayammum",
        "Zikir dan Do'a",
        "Muroja'ah Surah Pilihan",
      ],
    },
    "B Seluruhnya": {
      Senin: ["Membaca & Menulis Al-Qur'an", "Tahsin Surah"],
      Selasa: ["Membaca & Menulis Al-Qur'an", "Tahsin Surah"],
      Rabu: ["Membaca & Menulis Al-Qur'an", "Fiqih Solat"],
      Kamis: ["Membaca & Menulis Al-Qur'an", "Hadist"],
      Jumat: ["Aqidah Akhlaq/Adab", "Hafalan Do'a Harian", "Kesenian Islam"],
      Sabtu: [
        "Praktik Solat/Wudhu/Tayammum",
        "Zikir dan Do'a",
        "Muroja'ah Surah Pilihan",
      ],
    },
    "Qur'an 1 & 2": {
      Senin: ["Tadarus & Koreksi Tajwid"],
      Selasa: ["Setoran Ad-Dhuha - An-Naas", "Tadarus & Koreksi Tajwid"],
      Rabu: ["Tadarus & Koreksi Tajwid", "Fiqih Solat"],
      Kamis: ["Menyimak Bacaan Qori/Qoriah", "Hadist"],
      Jumat: ["Aqidah Akhlaq/Adab", "Hafalan Do'a Harian", "Kesenian Islam"],
      Sabtu: [
        "Praktik Solat/Wudhu/Tayammum",
        "Zikir dan Do'a",
        "Muroja'ah Ad-Dhuha - An-Naas",
      ],
    },
    "Tahfidz 1": {
      Senin: ["Ilmu Tajwid", "Setor Hafalan"],
      Selasa: ["Fiqih", "Setor Hafalan"],
      Rabu: ["Tadarus & Koreksi Tajwid", "Setor Hafalan"],
      Kamis: ["Tadarus & Koreksi Tajwid", "Setor Hafalan", "Hadist"],
      Jumat: ["Hadist", "Do'a Harian", "Kesenian Islam"],
      Sabtu: [
        "Zikir & Do'a",
        "Setor Hafalan Ayat Pilihan",
        "Setor Hafalan Terjemahan Pilihan",
      ],
    },
    "Tahfidz 2": {
      Senin: ["Ilmu Tajwid", "Setor Hafalan"],
      Selasa: ["Fiqih", "Setor Hafalan"],
      Rabu: [
        "Resume Kajian (Mendengar, Menulis & Presentasi)",
        "Setor Hafalan",
      ],
      Kamis: ["Bedah Buku (Menulis & Presentasi)", "Setor Hafalan", "Hadist"],
      Jumat: ["Resume Kajian", "Hadist Arba'in", "Kesenian Islam"],
      Sabtu: [
        "Zikir & Do'a",
        "Setor Hafalan Ayat Pilihan",
        "Setor Hafalan Terjemahan Pilihan",
      ],
    },
  },
};
