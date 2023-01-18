import { FastifyInstance } from 'fastify';
import { prisma } from './lib/prisma';
import { z } from 'zod';
import dayjs from 'dayjs';

export const appRoutes = async (app: FastifyInstance) => {
	app.post('/habits', async (request) => {
		const createHabitBody = z.object({
			name: z.string(),
			weekDays: z.array(z.number().min(0).max(6))
		});

		const { name, weekDays } = createHabitBody.parse(request.body);

		const today = dayjs().startOf('day').toDate();

		await prisma.habit.create({
			data: {
				name,
				created_at: today,
				weekDays: {
					create: weekDays.map((weekDay) => ({ week_day: weekDay }))
				}
			}
		});
	});

	app.get('/day', async (request) => {
		const getDayParams = z.object({
			date: z.coerce.date()
		});

		const { date } = getDayParams.parse(request.query);

		const parsedDate = dayjs(date).startOf('day');
		const weekDay = parsedDate.get('day');

		const possibleHabits = await prisma.habit.findMany({
			where: {
				created_at: {
					lte: date
				},
				weekDays: {
					some: {
						week_day: weekDay
					}
				}
			}
		});

		const day = await prisma.day.findUnique({
			where: {
				date: parsedDate.toDate()
			},
			include: {
				dayHabits: true
			}
		});

		const completedHabits = day?.dayHabits.map((dayHabit) => dayHabit.habit_id);

		return { possibleHabits, completedHabits };
	});
};
