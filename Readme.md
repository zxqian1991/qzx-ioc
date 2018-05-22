# Qzx-Ioc

 

> 简单的依赖注入的功能，其实就是自动的帮你创建实例。

## 安装

```bash
npm install qzx-ioc
```

## 使用

**User.ts**

```javascript
import { Injectable } from 'qzx-ioc';
@Injectable
export class User {
    private name: string;
    getName() {
        return this.name;
    }
    setName(name: string) {
        this.name = name;
    }
}
```

**Main1.ts**

```javascript
import { Ioc } from 'qzx-ioc';
let user: User = Ioc(User);
user.setName('jack');
console.log(user.getName()); // jack
```

**Main2.ts**

```javascript
import { Ioc } from 'qzx-ioc';
let user: User = Ioc(User);
console.log(user.getName()); // jack
```

可以看到这里使用的是同一个实例。

## 作为构造函数的参数

除了直接引用，也可以像`Angular2`里面在构造函数里进行依赖注入。

**test.ts**

```javascript
import { Injectable } from 'qzx-ioc';
import { User } from './user';
@Injectable
export class Test {
    constructor(
    	private user: User
    ) {
        
    }
    show() {
        this.user.getName();
    }
}
```

**Main.ts**

```javascript
import { Ioc } from 'qzx-ioc';
let test: Test = Ioc(Test);
test.show(); // jack
```

