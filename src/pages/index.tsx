import type { GetServerSideProps, NextPage } from 'next'

const RootPage: NextPage = () => null

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: '/atividades',
    permanent: false,
  },
})

export default RootPage
