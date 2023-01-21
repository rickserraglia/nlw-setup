import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import clsx from 'clsx';
import { api } from '../lib/axios';
import { generateProgressPercentage } from '../utils/generate-progress-percentage';
import { BackButton } from '../components/BackButton';
import { ProgressBar } from '../components/ProgressBar';
import { Checkbox } from '../components/Checkbox';
import { Loading } from '../components/Loading';
import { HabitsEmpty } from '../components/HabitsEmpty';

interface HabitParams {
	date: string;
}

interface DayInfoProps {
	possibleHabits: {
		id: string;
		name: string;
	}[];
	completedHabits: string[];
}

export const Habit = () => {
	const route = useRoute();
	const [loading, setLoading] = useState(true);
	const [dayInfo, setDayInfo] = useState<DayInfoProps>();
	const { date } = route.params as HabitParams;

	const parsedDate = dayjs(date);
	const isDateInPast = parsedDate.endOf('day').isBefore(new Date());
	const dayOfWeek = parsedDate.format('dddd');
	const dayAndMonth = parsedDate.format('DD/MM');

	const habitsProgress = dayInfo?.completedHabits.length
		? generateProgressPercentage(
				dayInfo.possibleHabits.length,
				dayInfo.completedHabits.length
		  )
		: 0;

	const handleToggleHabit = async (habitId: string) => {
		try {
			await api.patch(`/habits/${habitId}/toggle`);

			if (dayInfo?.completedHabits.includes(habitId)) {
				setDayInfo((prevState) => ({
					...prevState!,
					completedHabits: prevState!.completedHabits.filter(
						(completedHabitId) => completedHabitId !== habitId
					)
				}));
			} else {
				setDayInfo((prevState) => ({
					...prevState!,
					completedHabits: [...prevState!.completedHabits, habitId]
				}));
			}
		} catch (error) {
			Alert.alert('Ops', 'Não foi possível atualizar o status desse hábito.');
			console.log(error);
		}
	};

	const fetchHabits = async () => {
		try {
			setLoading(true);
			const response = await api.get('/day', {
				params: { date }
			});
			setDayInfo(response.data);
		} catch (error) {
			Alert.alert(
				'Ops',
				'Não foi possível carregar as informações dos hábitos.'
			);
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchHabits();
	}, []);

	if (loading) {
		return <Loading />;
	}

	return (
		<View className="flex-1 bg-background px-8 pt-16">
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 100 }}
			>
				<BackButton />
				<Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
					{dayOfWeek}
				</Text>
				<Text className="text-white font-extrabold text-3xl">
					{dayAndMonth}
				</Text>

				<ProgressBar progress={habitsProgress} />

				<View
					className={clsx('mt-6', {
						'opacity-50': isDateInPast
					})}
				>
					{dayInfo && dayInfo.possibleHabits.length > 0 ? (
						dayInfo.possibleHabits.map((habit) => (
							<Checkbox
								key={habit.id}
								title={habit.name}
								checked={dayInfo.completedHabits.includes(habit.id)}
								disabled={isDateInPast}
								onPress={() => handleToggleHabit(habit.id)}
							/>
						))
					) : (
						<HabitsEmpty />
					)}
				</View>

				{isDateInPast && (
					<Text className="text-white mt-10 text-center">
						Você não pode editar hábitos de uma data passada.
					</Text>
				)}
			</ScrollView>
		</View>
	);
};
