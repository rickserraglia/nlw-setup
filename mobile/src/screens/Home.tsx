import { ScrollView, Text, View } from 'react-native';
import { HabitDay, daySize } from '../components/HabitDay';
import { Header } from '../components/Header';

import { generateRangeDatesFromYearStart } from '../utils/generate-range-between-dates';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const datesFromYearStart = generateRangeDatesFromYearStart();
const minimumSummaryDatesSize = 18 * 5;
const amountOfDaysToFill = minimumSummaryDatesSize - datesFromYearStart.length;

export const Home = () => {
	return (
		<View className="flex-1 bg-background px-8 pt-16">
			<Header />

			<View className="flex-row mt-6 mb-2">
				{weekDays.map((weekDay, index) => (
					<Text
						key={`${weekDay}-${index}`}
						className="text-zinc-400 text-xl font-bold text-center mx-1"
						style={{ width: daySize }}
					>
						{weekDay}
					</Text>
				))}
			</View>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 100 }}
			>
				<View className="flex-row flex-wrap">
					{datesFromYearStart.map((date) => (
						<HabitDay key={date.toISOString()} />
					))}
					{amountOfDaysToFill > 0 &&
						Array.from({ length: amountOfDaysToFill }).map((_, index) => (
							<View
								key={index}
								className="bg-zinc-900 rounded-lg border-2 border-zinc-800 m-1 opacity-40"
								style={{ width: daySize, height: daySize }}
							/>
						))}
				</View>
			</ScrollView>
		</View>
	);
};
