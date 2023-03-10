import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'phosphor-react';
import { FormEvent, useState } from 'react';
import { api } from '../lib/axios';

const availableWeekDays = [
	'Domingo',
	'Segunda-Feira',
	'Terça-Feira',
	'Quarta-Feira',
	'Quinta-Feira',
	'Sexta-Feira',
	'Sábado'
];

export const NewHabitForm = () => {
	const [name, setName] = useState('');
	const [weekDays, setWeekDays] = useState<number[]>([]);

	const createNewHabit = async (event: FormEvent) => {
		event.preventDefault();

		if (!name || weekDays.length === 0) {
			return;
		}

		await api.post('/habits', {
			name,
			weekDays
		});

		alert('Hábito criado com sucesso!');

		setName('');
		setWeekDays([]);
	};

	const handleToggleWeekDay = (weekDay: number) => {
		if (weekDays.includes(weekDay)) {
			setWeekDays((prevState) => prevState.filter((day) => day !== weekDay));
		} else {
			setWeekDays((prevState) => [...prevState, weekDay]);
		}
	};

	return (
		<form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
			<label htmlFor="name" className="font-semibold leading-tight">
				Qual seu comprometimento?
			</label>
			<input
				type="text"
				id="name"
				placeholder="ex.: Exercícios, dormir bem, etc..."
				className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-zinc-900"
				autoFocus
				value={name}
				onChange={(event) => setName(event.target.value)}
			/>

			<label htmlFor="" className="font-semibold leading-tight mt-4">
				Qual a recorrência?
			</label>

			<div className="flex flex-col gap-2 mt-3">
				{availableWeekDays.map((weekDay, index) => (
					<Checkbox.Root
						key={weekDay}
						className="group flex items-center gap-3 focus:outline-none"
						checked={weekDays.includes(index)}
						onCheckedChange={() => handleToggleWeekDay(index)}
					>
						<div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 group-focus:ring-offset-zinc-900">
							<Checkbox.Indicator>
								<Check size={20} className="text-white" />
							</Checkbox.Indicator>
						</div>
						<span className="text-white leading-tight">{weekDay}</span>
					</Checkbox.Root>
				))}
			</div>

			<button
				type="submit"
				className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 focus:ring-offset-zinc-900"
			>
				<Check size={20} weight="bold" />
				Confirmar
			</button>
		</form>
	);
};
