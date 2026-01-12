import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const dataFile = path.join(process.cwd(), 'server', 'data', 'appointments.json');

async function readAppointments() {
  try {
    const raw = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeAppointments(list) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(list, null, 2), 'utf8');
}

app.get('/api/appointments', async (req, res) => {
  const list = await readAppointments();
  res.json(list);
});

app.post('/api/appointments', async (req, res) => {
  const { fullName, age, address, contact } = req.body || {};
  if (!fullName || !contact) {
    return res.status(400).json({ error: 'fullName and contact are required' });
  }
  const list = await readAppointments();
  const id = Date.now().toString();
  const appointment = { id, fullName, age, address, contact, createdAt: new Date().toISOString() };
  list.push(appointment);
  await writeAppointments(list);
  res.status(201).json(appointment);
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${PORT}`);
});
