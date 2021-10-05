import { Box, Flex, Heading, Divider, HStack, VStack, SimpleGrid, Button} from "@chakra-ui/react"
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link';
import { useMutation } from "react-query";

import { Input } from "../../components/Form/input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/api";
import { ActiveModelSerializer } from "miragejs";
import { queryClient } from "../../services/queryClient";
import router from "next/router";

type CreateUserFormData = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  };
  
  const CreateUserFormSchema = yup.object().shape({
    name: yup.string().required('Nome Obrigatório'),
    email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
    password: yup.string().required('Senha Obrigatória').min(6, 'no minimo 6 caracteres'),
    password_confirmation: yup.string().oneOf([
        null, yup.ref('password')
    ], 'As senhas precisam ser iguais')
  })

export default function CreateUser() {
    const createUser = useMutation(async (user: CreateUserFormData) => {
        const response = await api.post('users', {
            user:  {
                ...user,
                created_at: new Date(),
            }
        })

        return response.data.user;
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('users')
        }
    })
    
    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver<yup.AnyObjectSchema>(CreateUserFormSchema)
    })

    const handleCreateUser: SubmitHandler<CreateUserFormData> = async (values) => {
        await createUser.mutateAsync(values);

        router.push('/users');
    }
    
    return (
        <Box>
            <Header />

            <Flex w="100%" my="6" maxW="1480" mx="auto" px="6">
                <Sidebar />

                <Box 
                    as="form"
                    flex="1" 
                    borderRadius={8} 
                    bg="gray.800" 
                    p={["6", "8"]}
                    onSubmit={handleSubmit(handleCreateUser)}
                >
                    <Heading size="lg" fontWeight="normal">Criar usuário</Heading>

                    <Divider my="6" borderColor="gray.700"/>

                    <VStack spacing="8">
                        <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                            <Input 
                                {...register('name')}
                                error={formState.errors.name} 
                                label="Nome completo" 
                            />
                            <Input 
                                {...register('email')}
                                error={formState.errors.email} 
                                type="email" 
                                label="E-mail" 
                            />
                        </SimpleGrid>

                        <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                            <Input 
                                {...register('password')}
                                error={formState.errors.password} 
                                type="password" 
                                label="Senha" 
                            />
                            <Input 
                                {...register("password_confirmation")}
                                error={formState.errors.password_confirmation} 
                                type="password" 
                                label="Confirmação da senha" 
                            />
                        </SimpleGrid>
                    </VStack>

                    <Flex mt="8" justify="flex-end">
                        <HStack spacing="4">
                            <Link href="/users" passHref>
                                <Button as="a" colorScheme="whiteAlpha">Cancelar</Button>
                            </Link>
                            <Button 
                                type="submit" 
                                colorScheme="pink"
                                isLoading={formState.isSubmitting}
                            >Salvar</Button>
                        </HStack>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    )
}