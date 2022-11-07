import { useState, useEffect} from "react"
import { Share } from 'react-native'
import { HStack, useToast, VStack } from "native-base"
import { Header } from "../components/Header"
import { useRoute } from "@react-navigation/native"
import { Loading } from "../components/Loading";
import { PoolCardPros } from "../components/PoolCard";

import { api } from "../services/api"
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";

interface RouteParams {
  id: string; 
}

export function Details(){

  const [ optionSelected, setOptionSelectec] = useState<'Seus palpites' | 'Ranking do grupo'>('Seus palpites');
  const [ isLoading, setIsLoading ] = useState(true);
  const [ poolDetails, setPoolDetails ] = useState<PoolCardPros>({} as PoolCardPros);
  const route = useRoute();
  const toast = useToast();
  const { id } = route.params as RouteParams;

  async function handleCodeShare(){
    await Share.share({
      message: poolDetails.code
    })
  }

  async function fetchPoolDetails(){
    try {
      setIsLoading(true)
      const response = await api.get(`/pools/${id}`);
      setPoolDetails(response.data.pool);
      

    } catch (error) {
      console.log(error);
      toast.show({
        title: "Não foi possível carregar os detalhes do bolão",
        placement: 'top',
        bgColor: 'red.500',
      })

    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPoolDetails();
  }, [id])

  if (isLoading){
    return <Loading /> 
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title={poolDetails.title} showBackButton showShareButton onShare={handleCodeShare}/>
      {
        poolDetails._count?.participants < 0 ? 
        <VStack px={5} flex={1}>
          <PoolHeader data={poolDetails}/>
          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option title="Seus palpites" isSelected={optionSelected === 'Seus palpites'} onPress={() => setOptionSelectec('Seus palpites')}/>
            <Option title="Ranking do grupo" isSelected={optionSelected === 'Ranking do grupo'} onPress={() => setOptionSelectec('Ranking do grupo')}/>
          </HStack>
        </VStack>
        : <EmptyMyPoolList code={poolDetails.code}/>
      }
    </VStack>
  )
}