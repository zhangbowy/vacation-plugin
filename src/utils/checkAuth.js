import config from '@/config'

export default key => config.authMap[key] || false
