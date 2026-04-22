import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import obraRoutes from './routes/obra.routes'; // <-- 1. IMPORTAR AQUÍ

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Conectar las rutas
app.use('/api/auth', authRoutes);
app.use('/api/obras', obraRoutes); // <-- 2. CONECTAR AQUÍ

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor de ArtBlock corriendo en http://localhost:${PORT}`);
});