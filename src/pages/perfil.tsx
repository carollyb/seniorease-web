import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import type { NextPage } from 'next'

import { ProfileSettings } from '../presentation/profile'

const ProfilePage: NextPage = () => {
  return (
    <Box
      component="main"
      sx={{ bgcolor: 'background.default', minHeight: '100vh' }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <ProfileSettings mode="profile" />
      </Container>
    </Box>
  )
}

export default ProfilePage
