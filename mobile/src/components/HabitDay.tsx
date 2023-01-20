import {
	TouchableOpacity,
	Dimensions,
	TouchableOpacityProps
} from 'react-native';
import clsx from 'clsx';
import { generateProgressPercentage } from '../utils/generate-progress-percentage';
import dayjs from 'dayjs';

interface HabitDayProps extends TouchableOpacityProps {
	date: Date;
	amount?: number;
	completed?: number;
}

const weekDays = 7;
const screenHorizontalPadding = (32 * 2) / 5;

export const dayMarginBetween = 8;
export const daySize =
	Dimensions.get('screen').width / weekDays - (screenHorizontalPadding + 5);

export const HabitDay = ({
	date,
	amount = 0,
	completed = 0,
	...props
}: HabitDayProps) => {
	const accomplishedPercentage =
		amount > 0 ? generateProgressPercentage(amount, completed) : 0;
	const today = dayjs().startOf('day').toDate();
	const isCurrentDay = dayjs(date).isSame(today, 'day');

	return (
		<TouchableOpacity
			className={clsx('rounded-lg border-2 m-1', {
				'bg-zinc-900 border-zinc-800': accomplishedPercentage === 0,
				'bg-violet-900 border-violet-700':
					accomplishedPercentage > 0 && accomplishedPercentage < 20,
				'bg-violet-800 border-violet-600':
					accomplishedPercentage >= 20 && accomplishedPercentage < 40,
				'bg-violet-700 border-violet-500':
					accomplishedPercentage >= 40 && accomplishedPercentage < 60,
				'bg-violet-600 border-violet-500':
					accomplishedPercentage >= 60 && accomplishedPercentage < 80,
				'bg-violet-500 border-violet-400': accomplishedPercentage >= 80,
				'border-zinc-500 border-[3px]': isCurrentDay
			})}
			style={{ width: daySize, height: daySize }}
			activeOpacity={0.7}
			{...props}
		/>
	);
};
