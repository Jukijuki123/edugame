export interface LevelItem {
  id: string;
  word: string;
  translation: string;
  icon: string;
  targetZone?: string;
  color?: string;
}

export type GameMode = 'drag-and-drop' | 'matching' | 'bubble-pop' | 'connect-line';

export interface LevelData {
  id: string;
  levelNumber: number;
  title: string;
  category: string;
  mode: GameMode;
  instruction: string;
  instructionEn: string;
  themeColor: string;
  bgGradient: string;
  items: LevelItem[];
}

export const LEVELS: LevelData[] = [
  {
    id: 'level-1',
    levelNumber: 1,
    title: 'School Objects',
    category: 'Perlengkapan Sekolah',
    mode: 'drag-and-drop',
    instruction: 'Tarik perlengkapan sekolah ke siluet yang tepat!',
    instructionEn: 'Drag and drop each item to its matching shadow!',
    themeColor: '#38BDF8', // sky blue
    bgGradient: 'from-sky-100 to-blue-50',
    items: [
      {
        id: 'item-pencil',
        word: 'Pencil',
        translation: 'Pensil',
        icon: 'pencil',
        targetZone: 'zone-pencil',
      },
      {
        id: 'item-book',
        word: 'Book',
        translation: 'Buku',
        icon: 'book',
        targetZone: 'zone-book',
      },
      {
        id: 'item-backpack',
        word: 'Backpack',
        translation: 'Tas Sekolah',
        icon: 'backpack',
        targetZone: 'zone-backpack',
      },
      {
        id: 'item-ruler',
        word: 'Ruler',
        translation: 'Penggaris',
        icon: 'ruler',
        targetZone: 'zone-ruler',
      },
      {
        id: 'item-eraser',
        word: 'Eraser',
        translation: 'Penghapus',
        icon: 'eraser',
        targetZone: 'zone-eraser',
      },
      {
        id: 'item-scissors',
        word: 'Scissors',
        translation: 'Gunting',
        icon: 'scissors',
        targetZone: 'zone-scissors',
      },
    ],
  },
  {
    id: 'level-2',
    levelNumber: 2,
    title: 'Animal Friends',
    category: 'Hewan Lucu',
    mode: 'connect-line',
    instruction: 'Sambungkan gambar hewan ke kata Bahasa Inggris yang tepat!',
    instructionEn: 'Connect each animal picture to its correct English word!',
    themeColor: '#4ADE80', // green
    bgGradient: 'from-emerald-100 to-green-50',
    items: [
      {
        id: 'item-lion',
        word: 'Lion',
        translation: 'Singa',
        icon: 'lion',
      },
      {
        id: 'item-elephant',
        word: 'Elephant',
        translation: 'Gajah',
        icon: 'elephant',
      },
      {
        id: 'item-monkey',
        word: 'Monkey',
        translation: 'Monyet',
        icon: 'monkey',
      },
      {
        id: 'item-cat',
        word: 'Cat',
        translation: 'Kucing',
        icon: 'cat',
      },
      {
        id: 'item-rabbit',
        word: 'Rabbit',
        translation: 'Kelinci',
        icon: 'rabbit',
      },
      {
        id: 'item-dog',
        word: 'Dog',
        translation: 'Anjing',
        icon: 'dog',
      },
    ],
  },
  {
    id: 'level-3',
    levelNumber: 3,
    title: 'Bubble Pop: Fruits',
    category: 'Buah-buahan Manis',
    mode: 'bubble-pop',
    instruction: 'Dengarkan suara kata Bahasa Inggris, lalu pecahkan balon yang tepat!',
    instructionEn: 'Listen to the English word and pop the right bubble!',
    themeColor: '#FB7185', // rose/coral
    bgGradient: 'from-rose-100 to-orange-50',
    items: [
      {
        id: 'item-apple',
        word: 'Apple',
        translation: 'Apel',
        icon: 'apple',
      },
      {
        id: 'item-banana',
        word: 'Banana',
        translation: 'Pisang',
        icon: 'banana',
      },
      {
        id: 'item-orange',
        word: 'Orange',
        translation: 'Jeruk',
        icon: 'orange',
      },
      {
        id: 'item-strawberry',
        word: 'Strawberry',
        translation: 'Stroberi',
        icon: 'strawberry',
      },
    ],
  },
  {
    id: 'level-4',
    levelNumber: 4,
    title: 'Rainbow Colors',
    category: 'Warna Pelangi',
    mode: 'connect-line',
    instruction: 'Sambungkan warna ke kata Bahasa Inggris yang cocok!',
    instructionEn: 'Connect each color to its matching English word!',
    themeColor: '#A855F7', // purple
    bgGradient: 'from-purple-100 to-pink-50',
    items: [
      {
        id: 'item-red',
        word: 'Red',
        translation: 'Merah',
        icon: 'red',
      },
      {
        id: 'item-blue',
        word: 'Blue',
        translation: 'Biru',
        icon: 'blue',
      },
      {
        id: 'item-green',
        word: 'Green',
        translation: 'Hijau',
        icon: 'green',
      },
      {
        id: 'item-yellow',
        word: 'Yellow',
        translation: 'Kuning',
        icon: 'yellow',
      },
      {
        id: 'item-purple',
        word: 'Purple',
        translation: 'Ungu',
        icon: 'purple',
      },
    ],
  },
  {
    id: 'level-5',
    levelNumber: 5,
    title: 'My Cozy Room',
    category: 'Ruang Kamar',
    mode: 'drag-and-drop',
    instruction: 'Tarik perabotan kamar ke tempat yang sesuai!',
    instructionEn: 'Put room items into their correct silhouette positions!',
    themeColor: '#FBBF24', // amber yellow
    bgGradient: 'from-amber-100 to-yellow-50',
    items: [
      {
        id: 'item-bed',
        word: 'Bed',
        translation: 'Tempat Tidur',
        icon: 'bed',
        targetZone: 'zone-bed',
      },
      {
        id: 'item-lamp',
        word: 'Lamp',
        translation: 'Lampu Meja',
        icon: 'lamp',
        targetZone: 'zone-lamp',
      },
      {
        id: 'item-chair',
        word: 'Chair',
        translation: 'Kursi',
        icon: 'chair',
        targetZone: 'zone-chair',
      },
      {
        id: 'item-clock',
        word: 'Clock',
        translation: 'Jam Dinding',
        icon: 'clock',
        targetZone: 'zone-clock',
      },
      {
        id: 'item-pillow',
        word: 'Pillow',
        translation: 'Bantal',
        icon: 'pillow',
        targetZone: 'zone-pillow',
      },
      {
        id: 'item-table',
        word: 'Table',
        translation: 'Meja',
        icon: 'table',
        targetZone: 'zone-table',
      },
    ],
  },
];
