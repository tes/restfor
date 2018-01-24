# Restfor

## Create Restfor router for your express app

```js
import createRouter from 'restfor/createRouter'

...

const router = await createRouter({
  db: { host: '', database: '', username: '', password: '' },
  modelsPath: '...',
  routesPath: '...'
})

app.use('/api', router)
```

## Create Restfor component for your React app

```js
import createApp from 'restfor/createApp'

ReactDOM.render(
  createApp({ apiUrl: '.../api' }, register => {} ),
  document.getElementById('root')
)
```

The second argument (`viewFactory`) is optional.