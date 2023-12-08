import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';


describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    fakeUserService = {
      find: (email: string) => {
        const user = users.filter((user) => user.email === email);
        return Promise.resolve(user)
      },
      create: (name: string, email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999), 
          name, 
          email, 
          password,
        } as User;
        users.push(user)
        return Promise.resolve(user);
      },
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const user = await service.register('John Doe', 'hv3RU@example.com', 'password')
    console.log(user);

    expect(user.password).not.toEqual('password')
    const [salt, hash] = user.password.split('.')
    expect(salt).toBeDefined()
    expect(hash).toBeDefined()
  });

  it('should fail to create a user with an existing email', async () => {
    await service.register('John Doe', 'hv3RU@example.com', 'password');
    await expect(
      service.register('John Doe', 'hv3RU@example.com', 'password')
    ).rejects.toThrow('Email sudah terdaftar')
    
  });

  it('should fail if user login with invalid email', async () => {
    await expect(service.login('admin@mail.com', 'password')).rejects.toThrow(
      'Email tidak terdaftar'
    )
  })

  it('should fail if user login with invalid password', async () => {
    await service.register('John Doe', 'hv3RU@example.com', 'password');
    await expect(service.login('hv3RU@example.com', 'admin')
    ).rejects.toThrow('Password salah');
  })

  it('should login existing user', async () => {
    await service.register('John Doe', 'hv3RU@example.com', 'password');
    const user = await service.login('hv3RU@example.com', 'password');
    expect(user).toBeDefined()
  });
});
