import { useState } from 'react';
import {
	Alert,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BackButton } from '../components/BackButton';
import { Checkbox } from '../components/Checkbox';
import colors from 'tailwindcss/colors';
import { api } from '../lib/axios';

const availableWeekDays = [
	'Domingo',
	'Segunda',
	'Terça',
	'Quarta',
	'Quinta',
	'Sexta',
	'Sábado'
];

export const New = () => {
	const [name, setName] = useState<string>('');
	const [weekDays, setWeekDays] = useState<number[]>([]);

	const handleToggleWeekDay = (weekDayIndex: number) => {
		if (weekDays.includes(weekDayIndex)) {
			setWeekDays((prevState) =>
				prevState.filter((weekDay) => weekDay !== weekDayIndex)
			);
		} else {
			setWeekDays((prevState) => [...prevState, weekDayIndex]);
		}
	};

	const handleCreateHabit = async () => {
		try {
			if (!name.trim() || weekDays.length === 0) {
				return Alert.alert(
					'Ops',
					'Você precisa informar o nome do hábito e escolher ao menos um dia da semana.'
				);
			}

			await api.post('/habits', {
				name,
				weekDays
			});

			Alert.alert('Novo Hábito', 'Hábito criado com sucesso!');
			setName('');
			setWeekDays([]);
		} catch (error) {
			Alert.alert('Ops', 'Ocorreu um erro ao criar seu novo hábito.');
			console.log(error);
		}
	};

	return (
		<View className="flex-1 bg-background px-8 pt-16">
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 100 }}
			>
				<BackButton />
				<Text className="mt-6 text-white font-extrabold text-3xl">
					Criar Hábito
				</Text>
				<Text className="mt-6 text-white font-semibold text-3xl">
					Qual seu comprometimento?
				</Text>

				<TextInput
					className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
					placeholder="Ex.: academia, dormir cedo, etc..."
					placeholderTextColor={colors.zinc[400]}
					onChangeText={(text) => setName(text)}
					value={name}
				/>

				<Text className="font-semibold mt-4 mb-3 text-white text-base">
					Qual a recorrência?
				</Text>
				{availableWeekDays.map((weekDay, index) => (
					<Checkbox
						key={weekDay}
						title={weekDay}
						checked={weekDays.includes(index)}
						onPress={() => handleToggleWeekDay(index)}
					/>
				))}

				<TouchableOpacity
					activeOpacity={0.7}
					className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
					onPress={handleCreateHabit}
				>
					<Feather name="check" size={20} color={colors.white} />
					<Text className="font-semibold text-base text-white ml-2">
						Confirmar
					</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
};
