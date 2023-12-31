import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { Repository } from 'typeorm';
import { CreateItemDto } from './dtos/create-item.dto';
import { User } from '../users/user.entity';
import { QueryItemDto } from './dtos/query-item.dto';

@Injectable()
export class ItemsService {
    constructor(
        @InjectRepository(Item) private itemRepository: Repository<Item>,
    ) {}

    create(item: CreateItemDto, user: User) {
        const newItem = this.itemRepository.create(item);
        newItem.user = user;
        return this.itemRepository.save(newItem);
    }

    async approveItem(id: number, approved: boolean) {
        const item = await this.itemRepository.findOneBy({id});
        if(!item) {
            throw new NotFoundException('item not found');
        }
        item.approved = approved;
        return this.itemRepository.save(item);
    }

    getAllItems(queryItemDto: QueryItemDto) {
        return this.itemRepository
        .createQueryBuilder()
        .select('*')
        .where('approved = :approved', { approved: true })
        .andWhere('name LIKE :name', { name: `%${queryItemDto.name}%` })
        .andWhere('category LIKE :category', { category: `%${queryItemDto.category}%` })
        .andWhere('location LIKE :location', { location: `%${queryItemDto.location}%` })
        .getRawMany();
    }
}
