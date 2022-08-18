# React starter
- [React starter](#react-starter)
  - [序言](#序言)
  - [React主要术语介绍](#react主要术语介绍)
    - [**1. Class Component(类组件)**](#1-class-component类组件)
    - [**2. Functional Component(函数组件)**](#2-functional-component函数组件)
    - [**3. Props**](#3-props)
    - [**4. State**](#4-state)
    - [**5. 代码拆分**](#5-代码拆分)
    - [**6. HOC(High Order Component)**](#6-hochigh-order-component)
    - [**7. Context(上下文)**](#7-context上下文)
  - [MWS的简介](#mws的简介)
  - [MWS的限制和注意事项](#mws的限制和注意事项)
## 序言
> 建议先从官网文档阅读，这样会让你更快对React这个框架有一个更好的了解
> ##### 一般React做网站应用入门可以分为以下几点进行，如果你没有任何基础，可以自行根据以下步骤先去了解：
+ [环境搭建和准备](https://zh-hans.reactjs.org/docs/create-a-new-react-app.html)
+ [了解Webpack工具的基础](https://wizardforcel.gitbooks.io/reactjs101/content/Ch02/webpack-dev-enviroment.html)
+ [路由的基本概念](https://react-guide.github.io/react-router-cn/)
+ [ES6的语法基础(可选)](https://es6.ruanyifeng.com/#docs/string-methods)

## React主要术语介绍

1. Class Component (类组件)
2. Functional Component(函数组件)
3. Props (组件参数)
4. State (组件状态)
5. 代码拆分
6. HOC (高阶组件)
7. Context (上下文)

> 以下代码均可直接粘贴到App.js的入口文件来运行测试

### **1. Class Component(类组件)**
> 在 React vsersion < 16.8 之前，Class Component是跟踪 React 组件状态和生命周期的唯一方法。 功能组件被认为是"无状态的"。所以设计组件我们会使用如下伪代码的类似方式进行。
>

```javascript
// MyComponent.js
import React from 'react'

class MyComponent extends React.Component {
  render() {
    return <div>{this.props.name}</div>;
  }
}

// App.js
// import MyComponent from "./MyComponent"

export default function App () => {
    return <MyComponent name='im class component' />
}
```
**output**
```html
    <div>im class component</div>
```

### **2. Functional Component(函数组件)**
> 在 React vsersion > 16.8 之后，随着 Hooks 的加入，Function Component几乎可以完全覆盖Class Component的所有功能。 以至于您可能永远不需要在React 中使用 Class 组件。
> 
> ##### **备注：** 虽然你仍然可以使用Class Component, 不过Functional Component是首选

```javascript
import React from 'react'
// MyComponent.js
function MyComponent(props) {
    return <div >im functional component</div>
}

// App.js
import MyComponent from "./MyComponent"

export default function App () => {
    return <MyComponent />
}
```
**output**
```html
    <div>im functional component</div>
```
### **3. Props**
> Props是拆分组件的入参，根据单项数据流的描述，你应该保持这个参数不被组件改变，这个概念和Vue的组件设计是类似的，只不过Vue有双向绑定语法糖来简化书写的代码量。以下我们来看一段伪代码，简单的写react组件并在入口调用它。

```javascript

// MyComponent.js
function MyComponent(props) {
    return <div >{props.name}</div>
}

// App.js
// import MyComponent from "./MyComponent"

export default function App () => {
    return <MyComponent name='im my component, my name pass from props' />
}
```
**output**
```html
    <div>im my component, my name pass from props</div>
```
### **4. State**
> state和Vue里面的data概念是类似的，可以理解成是对当前组件的状态管理的集，以下给出一个简单的例子说明。
> 根据上面我们学到的基础，我们把MyComponent稍微改装一下，把名字改成Counter，然后我们加入**useState**这个hook，用于让当前的functional Component具备管理状态的能力。然后为Counter组件内渲染的button加入点击事件，并在该点击的时间内执行setCount让count的数值改变。
> ##### 试着把useState(0)的0改成10，就会让count这个状态初始值变成10开始。

```javascript

// MyComponent.js
import { useState } from 'react'
const Counter = (props) => {
    const [count, setCount] = useState(0)
    const onClick = () => {
        setCount(count + 1)
    }
    return (<>
        <button onClick={onClick}>current: {count}</button>
    </>)
}

// App.js
// import Counter from "./Counter"

export default function App () => {
    return <Counter />
}
```
**output**
```html
    <div>current: 0</div>
```

> 如果你有Vue的基础，你也可以简单的把上面的代码类比成以下的代码，可以方便理解

```html
<html>
    <div id="example">
        <button @click='increment'>current: {{count}}</button>
    </div>
</html>
```
```javascript
new Vue({
    el: '#example',
    data: {
        count: 0
    },
    methods: {
        increment() {
            this.count += 1
        }
    }
})

```
### **5. 代码拆分**
> 当一个项目的业务量到达一定程度，如果我们不进行一些基础功能和业务的拆分，这会让这个项目的结构和代码比较难阅读和理解，而且修改的难度和复杂程度也会成倍上升。
> 以下先从一种基础的业务描述一种场景，例如我们在开发UI的过程中会经常遇到点击某个按钮后，按钮需要禁用并展示加载的indicator，在加载完成后则状态复原。
> 
> **在通常的情况下，我们可能会以下面这种方式的代码来进行开发， 但你可能很快就会发现，有这种需求的业务UI其实会出现好多次，而每次变化的可能只是请求的异步函数和展示的label不一样，但其核心的业务流程是一致的，无非就是```状态初始化 -> 执行异步函数 -> 等待异步结果返回 -> 改变状态```**

```javascript
import { useState, useMemo } from 'react'

export default function Feature() {
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('wait for query api to get message')
    const queryApi = () => {
        return new Promise((resolve,) => {
            setTimeout(() => resolve({ message: 'query api success!' }), 1000)
        })
    }
    
    const onClick = async() => {
        setIsLoading(true)
        const { message } = await queryApi()
        setMessage(message)
        setIsLoading(false)
    }

    const styles = useMemo(() => {
        return {
            color: isLoading ? '#a1a1a1' : 'black'
        }
    }, [isLoading])

    const Loading = useMemo(() => {
        return isLoading && <span>loading...</span>
    }, [isLoading])

    return (<>
        <h2>{message}</h2>
        <button style={styles} disabled={isLoading} onClick={onClick}>{Loading}query api</button>
    </>)
}
```
> **我们尝试从组件拆分的角度来把上述的代码按照需求进行拆解**
> 
> 可能你会发现，代码量貌似比之前的那种还要多，那为什么还要拆呢？我们先来想象一下，如果我们新增一个Feature2的业务入口，而里面同时也用到了按钮和loading的状态UI，如果按照第一种方式，那你可能会整个Feature复制出来，然后rename为Feature2，改以下queryApi里面请求api的逻辑，然后就交付了。但这个时候，UI需要你把loading的状态从显示```loading...```改成一个动态的Icon，不断转动。这个时候可能你就需要同时修改Feature和你刚才复制后rename的Feature2里面的Loading控件来同时修改。而如果我们采取第二种的拆分方式，那么我们其实只需要打开Loading的组件修改就可以同时impact两个引用的地方了。

```javascript
// Loading.js
function Loading(props) {
    const { isLoading } = props
    return (
        isLoading && <span>loading...</span>
    )
}

// Trigger.js
function Trigger(props) {
    const { disabled, children = 'default label', ...rest } = props
    const styles = useMemo(() => {
        return {
            color: disabled ? '#a1a1a1' : 'black'
        }
    }, [disabled])
    return (
        <button style={styles} disabled={disabled} {...rest}>{children}</button>
    )
}

// Feature.js (Entry)
import { useState, useMemo } from 'react'
function Feature() {
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('wait for query api to get message')
    const queryApi = () => {
        return new Promise((resolve,) => {
            setTimeout(() => resolve({ message: 'query api success!' }), 1000)
        })
    }
    
    const onClick = async() => {
        setIsLoading(true)
        const { message } = await queryApi()
        setMessage(message)
        setIsLoading(false)
    }

    return (<>
        <h2>{message}</h2>
        <Trigger disabled={isLoading} onClick={onClick}>
            <Loading isLoading={isLoading}/>
            query api
        </Trigger>
    </>)
}

export default Feature

```

### **6. HOC(High Order Component)**
> HOC中文意思是高阶组件，可以理解成是高阶函数的一个延伸。它不属于React的一部分或者任何api，你更应该将它理解成是一种组件复用的技巧。
> 
> 具体而言，高阶组件是参数为组件，返回值为新组件的函数。上面的代码有介绍到，组件拆分是将 props 转换为 UI，而高阶组件是将组件转换为另一个组件。这里碍于边幅问题不能详细的描述，但我们还是可以基于上面那个简单的场景，继续深化以下。下面这段代码将演示一下，如何新增了一个高阶组件
> 
> 细心观察会下面这段代码其实新增了一个**withLoading**的高阶函数，然后把isLoading的控制搬到了这个函数里面。
> 
> 首先讲解一下，第一层函数的形参是一个options，可以理解成是针对这个HOC的一个配置参数项。然后再返回一个函数，这里传入的参数是一个React的合法组件（可以是类组件也可以是函数组件），然后在这个基础上再返回了一个函数，这个函数实际就是一个函数组件，在里面直接返回了对传入的Component的渲染，并把对应要处理的状态加入，让这个函数在包装后具备Loading的状态控制。
> 
> 然后你可以尝试一下把这段代码最后的```withLoading()(Feature)```改成```Feature```，你会发现Feature依然可以正常执行，并且message依然可以正常显示，唯一缺少了的就是Loading的状态控制。这样从切面的切入可以大大减少我们业务层代码之间的相互依赖，让每个组件可以灵活嵌套所需的功能。
>
> **当然，这个withLoading的HOC其实只是为了掩饰如何创建，应用高阶组件而设计，并且承接了上面一部分的代码，所以其实是存在较多的耦合的，但相信阅读到这里的各位应该也有想法去如何改进或者把它运用到实际的项目中去。**


```javascript
const withLoading = (options = {}) => (Component) => {
    const HOC = (props) => {
        const [isLoading, setIsLoading] = useState(options?.isLoading)
        const setLoading = (isLoading) => {
            setIsLoading(isLoading)
        }

        const callAsync = async(promise) => {
            setIsLoading(true)
            const response = await promise
            setIsLoading(false)
            return response
        }

        return <Component isLoading={isLoading} setLoading={setLoading} callAsync={callAsync}></Component>
    }
    return HOC
}


function Loading(props) {
    const { isLoading } = props
    return (
        isLoading ? <span>loading...</span> : <></>
    )
}

function Trigger(props) {
    const { disabled, children = 'default label', ...rest } = props
    const styles = useMemo(() => {
        return {
            color: disabled ? '#a1a1a1' : 'black'
        }
    }, [disabled])
    return (
        <button style={styles} disabled={disabled} {...rest}>{children}</button>
    )
}

// Feature.js (Entry)
import { useState, useMemo } from 'react'
function Feature(props) {
    const { isLoading, callAsync } = props
    const [message, setMessage] = useState('wait for query api to get message')
    const queryApi = () => {
        return new Promise((resolve,) => {
            setTimeout(() => resolve({ message: 'query api success!' }), 1000)
        })
    }
    
    const onClick = async () => {
        const { message } = callAsync ? await callAsync?.(queryApi()) : await queryApi()
        setMessage(message)
    }

    return (
        <>
            <h2>{message}</h2>
            <Trigger disabled={isLoading} onClick={onClick}>
                <Loading isLoading={isLoading}/>
                query api
            </Trigger>
        </>
    )
}

export default withLoading()(Feature)
```

### **7. Context(上下文)**
> React中文意思是上下文，是React中对于跨组件共享状态和控制状态的其中一种手段。可以类比成vue的provider和inject，只是vue从设计上没有提供更改provider的值就是了，这是和react的context有根本上的区别的。
> 
> 具体而言，上下文就是可以理解成在顶层包装好一个状态集合，然后这个层下的所有子组件都可以通过useContext来获取这个共享的状态集。
> 
> 细心观察会这段代码还是在上一个HOC的示例代码基础上，其实新增了一个**LoadingContext**和**LoadingProvider**的声明，其中可以看出**LoadingProvider**也是一个React的函数组件，里面基本的实现就是把外部传入的props除去children后通过value这个props传到**LoadingContext.Provider**这个组件里面。然后把排除出来的children单独渲染在**LoadingContext.Provider**里面。一个简单的上下文声明就算完成了
> 
> 然后再往下看，在**Feature**里面的isLoading去掉了，改由在Loading和Trigger两个组件内自行调用useContext来获取。改动完后运行可以看见其实和之前的功能是没有任何改变。但就可以让平级的Trigger和Loading两个子组件可以脱离父级组件的参数传递限制并统一接受顶层上下文的状态来单独运行。
> 
> 当然最后还是说一下，这里只是为了简单演示如何使用Context，但这段代码其实还是有很多改进的地方，这就需要你们在实际项目开发中去思考了，这里碍于边幅将不过多赘述。

```javascript

import { useState, useMemo, createContext, useContext } from 'react'

const LoadingContext = createContext()

const LoadingProvider = (props) => {
    const {children, ...rest} = props
    return (
        <LoadingContext.Provider
            value={rest}>
            {children}
        </LoadingContext.Provider>
    )
}

const withLoading = (options ={}) => (Component) => {
    const HOC = (props) => {
        const [isLoading, setIsLoading] = useState(options?.isLoading)
        const setLoading = (isLoading) => {
            setIsLoading(isLoading)
        }

        const callAsync = async(promise) => {
            setIsLoading(true)
            const response = await promise
            setIsLoading(false)
            return response
        }

        const parsedProps = useMemo(() => {
            return {
                isLoading,
                setLoading,
                callAsync,
            }
        }, [isLoading, setLoading, callAsync])

        return (<LoadingProvider {...parsedProps}>
            <Component {...parsedProps} {...props} />
        </LoadingProvider>)
    }
    return HOC
}


function Loading(props) {
    const { isLoading } = useContext(LoadingContext)
    return (
        isLoading ? <span>loading...</span> : <></>
    )
}

function Trigger(props) {
    const { disabled, children = 'default label', ...rest } = props
    const { isLoading } = useContext(LoadingContext)
    console.info({isLoading})
    const styles = useMemo(() => {
        return {
            color: (isLoading || disabled) ? '#a1a1a1' : 'black'
        }
    }, [disabled, isLoading])
    return (
        <button style={styles} disabled={isLoading || disabled} {...rest}>{children}</button>
    )
}

// Feature.js (Entry)
function Feature(props) {
    const { callAsync } = props
    const [message, setMessage] = useState('wait for query api to get message')
    const queryApi = () => {
        return new Promise((resolve,) => {
            setTimeout(() => resolve({ message: 'query api success!' }), 1000)
        })
    }
    
    const onClick = async () => {
        const { message } = callAsync ? await callAsync?.(queryApi()) : await queryApi()
        setMessage(message)
    }

    return (
        <>
            <h2>{message}</h2>
            <Trigger onClick={onClick}>
                <Loading />
                query api
            </Trigger>
        </>
    )
}

export default withLoading()(Feature)

```

