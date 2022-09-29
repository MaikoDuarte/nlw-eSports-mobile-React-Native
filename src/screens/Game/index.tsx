import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Entypo } from '@expo/vector-icons';

import logoImg from '../../assets/logo-nlw-esports.png';
import { Background } from '../../components/Background';

import { styles } from './styles';

import { GameParams } from '../../@types/navigation';
import { Text, FlatList, Image, TouchableOpacity, View } from 'react-native';
import { THEME } from '../../theme';
import { Heading } from '../../components/Heading';
import React, { useEffect, useState } from 'react';
import { DuoCard, DuoCardProps } from '../../DuoCard';
import { DuoMatch } from '../../components/DuoMatch';


export function Game() {

    const navigation = useNavigation();
    const route = useRoute();
    const game = route.params as GameParams;

    const [duos, setDuos] = useState<DuoCardProps[]>([]);
    const [discordDuoSelected, setDiscordDuoSelected] = useState('');

    function handleGoBack() {
        navigation.goBack();
    }

    async function getDiscordUser(adsId: string) {
       fetch(`http://192.168.0.100:3333/ads/${adsId}/discord`)
        .then(response => response.json())
        .then(data => setDiscordDuoSelected(data.discord));
    }

    useEffect(() => {
        fetch(`http://192.168.0.100:3333/games/${game.id}/ads`)
          .then(response => response.json())
          .then(data => setDuos(data));
      }, []);
    

    return (
        <Background>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>

                    <TouchableOpacity onPress={handleGoBack}>
                        <Entypo
                        name="chevron-thin-left"
                        color={THEME.COLORS.CAPTION_300}
                        size={20}
                        />


                    </TouchableOpacity>
                    <Image
                    source={logoImg}
                    style={styles.logo}
                    />

                    <View style={styles.right}/>
                </View>

                <Image
                source={{uri: game.bannerUrl }}
                style={styles.cover}
                resizeMode="cover"

                />

                <Heading
                title={game.title}
                subtitle="Conecte-se e comece a jogar!"
                />

                <FlatList
                data={duos}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    
                <DuoCard 
                data={item}
                onConnect={() => getDiscordUser(item.id)} />

                )}
                horizontal
                style={styles.containerList}
                contentContainerStyle={[duos.length > 0 ? styles.contentList : styles.emptyListContent]}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyListText}>
                        Não há anúncios publicados ainda.
                    </Text>
                )}
                    />

                    <DuoMatch 
                    visible={discordDuoSelected.length > 0}
                    discord={discordDuoSelected}
                    onClose={() => setDiscordDuoSelected('')}
                    />

            </SafeAreaView>


        </Background>

    );
}