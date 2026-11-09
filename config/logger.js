// ./config/logger.js
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize } = format;

// Definición del formato de log
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
  level: 'info', // Nivel mínimo de log
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    myFormat
  ),
  transports: [
    // Transportes para dónde irán los logs
    new transports.File({ filename: 'error.log', level: 'error' }), // Logs de error a archivo
    new transports.File({ filename: 'combined.log' }), // Todos los logs a archivo
    new transports.Console({ // Logs a la consola
        format: combine(
            colorize(),
            myFormat
        )
    })
  ],
});

export default logger;
