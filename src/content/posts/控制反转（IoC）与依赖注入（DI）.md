---
title: 控制反转（IoC）与依赖注入（DI）
description: Spring框架经久不衰的魅力
categories:
  - 计算机
tags:
  - SpringBoot
  - 后端
column: SpringBoot
cover:
status: true
pinned: false
aiSummary: true
date: 2026-01-15 19:27
updated: 2026-01-15 22:57
slug: "230976"
---
> [!tip] 观前提示
> 由于个人写的不是很好，所以此文经过 AI 润色后发布

---

在Java企业级开发领域，Spring框架无疑是基石般的存在。而谈及Spring，<mark style="color:#d08770">控制反转</mark>[^1] 与<mark style="color:#d08770">依赖注入</mark>[^2]是两个无法绕开的核心理念。它们不仅是Spring框架的基石，更是现代软件设计思想的重要体现。

## 一、核心理念：什么是IoC与DI？

简单来说：

- **控制反转（Inversion of Control, IoC）** 是一种**设计思想**，它将程序组件的创建、组装与控制权从应用程序代码转移到外部容器。
- **依赖注入（Dependency Injection, DI）** 是IoC思想的一种**具体实现方式**，通过外部容器将组件所需的依赖关系“注入”到组件中。

> 关键理解：**IoC是“设计思想”，DI是实现的“手段”**。

### 传统编程方式

在Spring框架出现之前（或称“传统编程方式”中），对象的创建与依赖管理完全由开发者手动控制，通常通过`new`关键字实现。这种方式导致组件间耦合度极高。

来个简单的例子

```java
// 1. 数据访问层接口
public interface UserDao {
    void addUser();
}

// 2. 数据访问层实现
public class UserDaoImpl implements UserDao {
    @Override
    public void addUser() {
        System.out.println("执行添加用户的数据库操作");
    }
}

// 3. 服务层（强依赖具体实现）
public class UserService {
    // 问题所在：直接实例化具体实现类，紧密耦合
    private UserDao userDao = new UserDaoImpl();

    public void addUser() {
        userDao.addUser();
        System.out.println("服务层：完成添加用户的业务逻辑");
    }
}

// 4. 应用入口
public class TestWithoutIOC {
    public static void main(String[] args) {
        UserService userService = new UserService();
        userService.addUser();
    }
}
```

这段简单的代码已经暴露了传统方式的三大问题：

1. **紧耦合**：`UserService`直接依赖`UserDaoImpl`的具体实现
2. **难以测试**：无法轻松替换`UserDao`的实现进行单元测试
3. **难以维护**：如需更换数据访问实现，必须修改`UserService`源码

为了快速开发，我们要解决这三个根本性问题：

1. **谁负责创建组件？**
2. **谁负责根据依赖关系组装组件？**
3. **销毁时如何确保依赖顺序正确？**

## 二、Spring的解决方案：IoC容器

Spring通过IoC容器解决了上述问题。在IoC模式下，控制权发生了反转：从应用程序转移到了IoC容器。所有组件不再由应用程序创建和配置，而是由IoC容器负责管理。

```java
// 1. 数据访问层接口（保持不变）
public interface UserDao {
    void addUser();
}

// 2. 数据访问层实现：交由Spring管理
import org.springframework.stereotype.Component;

@Component // 声明此类由Spring容器管理
public class UserDaoImpl implements UserDao {
    @Override
    public void addUser() {
        System.out.println("执行添加用户的数据库操作");
    }
}

// 3. 服务层：声明依赖，不负责创建
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component // 声明此类由Spring容器管理
public class UserService {
    @Autowired // 告知Spring需要注入UserDao实例
    private UserDao userDao; // 仅声明依赖，不实例化

    public void addUser() {
        userDao.addUser();
        System.out.println("服务层：完成添加用户的业务逻辑");
    }
}

// 4. Spring应用启动类
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

@SpringBootApplication // 启用Spring Boot自动配置
public class SpringIocApp {
    public static void main(String[] args) {
        // 启动Spring IoC容器
        ApplicationContext context = SpringApplication.run(SpringIocApp.class, args);
        
        // 从容器中获取Bean实例
        UserService userService = context.getBean(UserService.class);
        userService.addUser();
    }
}
```

## 三、依赖注入的三种方式

Spring提供了三种主要的依赖注入方式，各有适用场景。

### 1. 字段注入（Field Injection）

直接在字段上使用`@Autowired`注解，是最简洁的方式。

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserService {
    @Autowired
    private UserDao userDao; // 简洁直观

    public void addUser() {
        userDao.addUser();
    }
}
```

**特点分析：**
- 优点：代码极度简洁，减少样板代码
- 缺点：不支持final字段、测试困难、可能隐藏过度依赖问题
- 适用场景：快速原型开发，简单业务场景

### 2. Setter方法注入（Setter Injection）

通过Setter方法注入依赖，提供更好的灵活性。

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserService {
    private UserDao userDao;

    @Autowired
    public void setUserDao(UserDao userDao) {
        this.userDao = userDao; // 通过Setter方法注入
    }

    public void addUser() {
        userDao.addUser();
    }
}
```

**特点分析：**
- 优点：支持可选依赖、支持运行时动态替换
- 缺点：代码较繁琐、存在线程安全风险
- 适用场景：配置类中的可选组件，需要动态切换实现的场景

### 3. 构造器注入（Constructor Injection）

**Spring官方推荐的首选方式**，尤其在Spring 4.3+版本后，单一构造器可省略`@Autowired`。

```java
import org.springframework.stereotype.Component;

@Component
public class UserService {
    private final UserDao userDao; // 使用final确保不可变性

    // 构造器注入：依赖关系明确且强制
    public UserService(UserDao userDao) {
        this.userDao = userDao;
    }

    public void addUser() {
        userDao.addUser();
    }
}
```

当存在多个构造器时，需明确指定注入构造器：

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserService {
    private final UserDao userDao;

    @Autowired // 明确标注使用此构造器进行注入
    public UserService(UserDao userDao) {
        this.userDao = userDao;
    }

    // 其他构造器（Spring不会使用）
    public UserService() {
        this.userDao = null;
    }

    public void addUser() {
        userDao.addUser();
    }
}
```

**特点分析：**
- ✅ 优点：强制依赖保证、线程安全、测试友好、依赖关系清晰
- ❌ 缺点：依赖过多时构造器参数较长
- 📊 适用场景：绝大多数业务场景，特别是核心业务组件

## 四、三种注入方式对比

| 注入方式 | 优点 | 缺点 | 推荐指数 |
|---------|------|------|----------|
| **字段注入** | 代码极简，快速开发 | 测试困难，不支持final，隐藏依赖 | ⭐⭐ |
| **Setter注入** | 支持可选依赖，动态替换 | 线程安全隐患，代码繁琐 | ⭐⭐⭐ |
| **构造器注入** | 强制依赖，线程安全，测试友好，关系清晰 | 依赖多时参数较长 | ⭐⭐⭐⭐⭐ |

## 五、总结

控制反转（IoC）和依赖注入（DI）是Spring框架的基石，理解它们的本质和实践方式对于编写可维护、可测试的Spring应用至关重要。构造器注入作为Spring官方推荐的首选方式，应成为我们开发中的默认选择。它不仅保证了代码的健壮性和可测试性，更通过清晰的依赖声明推动了更合理的软件设计。

记住：**优秀的框架不仅提供便利，更引导良好的设计习惯**。掌握IoC与DI，不仅是学习Spring的使用，更是培养面向对象设计的重要思维方式。

---

**注**：

[^1]: IoC：Inversion of Control，控制反转
[^2]: DI：Dependency Injection，依赖注入
