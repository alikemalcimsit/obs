(require('dotenv').config)();
const express = require('express');
const cors = require('cors');
const prisma = require('./utils/prismaClient');

// Routes
const authRoutes = require('./routes/auth.routes');
const ogrenciRoutes = require('./routes/ogrenci.routes');
const ogretmenRoutes = require('./routes/ogretmen.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', async (req, res) => {
	try {
		await prisma.$queryRaw`SELECT 1`;
		res.json({ ok: true, message: 'Server is healthy' });
	} catch (err) {
		res.status(500).json({ ok: false, error: err.message });
	}
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ogrenci', ogrenciRoutes);
app.use('/api/ogretmen', ogretmenRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use((req, res) => {
	res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
	console.log(`🚀 OBS Server listening on http://localhost:${port}`);
	console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
	console.log('\n🛑 Shutting down gracefully...');
	await prisma.$disconnect();
	server.close(() => {
		console.log('✅ Server closed');
		process.exit(0);
	});
});

