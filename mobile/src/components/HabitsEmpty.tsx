import { Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const HabitsEmpty = () => {
	const { navigate } = useNavigation();

	return (
		<Text className="text-zinc-400 text-base">
			Não há hábitos para este dia{' '}
			<Text
				className="text-violet-400 text-base underline active:text-violet-500"
				onPress={() => navigate('new')}
			>
				comece cadastrando um.
			</Text>
		</Text>
	);
};
