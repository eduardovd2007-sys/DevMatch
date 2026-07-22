import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { registerUser, loginUser } from './controllers/authController';
import { createProject, getAllProjects, getProjectById, updateProjectStatus, deleteProject, getLeaderProjects, createLeaderProject, getProjectMetrics } from './controllers/projectController';
import { applyToProject, updateApplicationStatus, getUserApplications, getProjectApplicants, updateApplicantStatus, simulateApplicantMatch } from './controllers/postulacionController';
import { createSkill, assignSkillToUser, assignSkillToProject } from './controllers/skillController';
import { getMatchesForUser } from './controllers/matchController';
import { getAllUsers, getUserProfile, updateUserProfile, updateUserSchedule } from './controllers/userController';
import { getSystemStats } from './controllers/statsController';
import { generateTechTest, saveTechTestScore } from './controllers/evalController';
import { getPsychometricQuestions, savePsychometricRole } from './controllers/psicometricoController';
import { getNotifications, markAsRead } from './controllers/notificacionController';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Hola Mundo! El backend de DevMatch está vivo y conectado a PostgreSQL 🚀');
});

app.post('/api/register', registerUser);
app.post('/api/login', loginUser);
app.post('/api/projects', createProject);
app.get('/api/projects', getAllProjects);
app.get('/api/projects/:id', getProjectById);
app.put('/api/projects/:id/status', updateProjectStatus);
app.delete('/api/projects/:id', deleteProject);

app.get('/api/lider/proyectos', getLeaderProjects);
app.get('/api/lider/proyectos/:id', getProjectById);
app.post('/api/lider/proyectos', createLeaderProject);
app.get('/api/lider/proyectos/:id/metricas', getProjectMetrics);
app.get('/api/lider/proyectos/:id/postulantes', getProjectApplicants);
app.patch('/api/lider/proyectos/:projectId/postulantes/:applicantId', updateApplicantStatus);
app.post('/api/lider/proyectos/:projectId/postulantes/:applicantId/simular', simulateApplicantMatch);

app.post('/api/applications', applyToProject);
app.put('/api/applications/:id/status', updateApplicationStatus);

app.post('/api/skills', createSkill);
app.post('/api/users/skills', assignSkillToUser);
app.post('/api/projects/skills', assignSkillToProject);

app.get('/api/users/:id/matches', getMatchesForUser);

app.get('/api/users/:id', getUserProfile);
app.put('/api/users/:id', updateUserProfile);
app.get('/api/users', getAllUsers);
app.put('/api/users/:id/horario', updateUserSchedule);
app.get('/api/users/:id/applications', getUserApplications);

app.get('/api/stats', getSystemStats);

app.post('/api/users/:id/stack-test', generateTechTest);
app.post('/api/users/:id/score', saveTechTestScore);

app.get('/api/psychometric/questions', getPsychometricQuestions);
app.post('/api/users/:id/psychometric-role', savePsychometricRole);

app.get('/api/users/:id/notifications', getNotifications);
app.patch('/api/notifications/:id/leida', markAsRead);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});