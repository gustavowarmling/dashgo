import { Flex, Box, Text, Avatar } from '@chakra-ui/react';

interface ProfileProps {
    showProfileData?: boolean;
}

export function Profile({ showProfileData = true }: ProfileProps) {
    return (
        <Flex align="center">
            {showProfileData && (
                <Box mr="4" textAlign="right">
                    <Text>Mateus Warmling</Text>
                    <Text color="gray.300" fontSize="small">
                        mateuswarmling@gmail.com
                    </Text>
                </Box>
            )}

            <Avatar size="md" name="Mateus Warmling" src="https://github.com/MateusRWarmling.png" />
        </Flex>
    );
}