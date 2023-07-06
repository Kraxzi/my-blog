import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { BlogPostResolver } from './blog-post.resolver';
import { BlogPost } from './entities/blog-post.entity';
import { BlogModule } from '../blog/blog.module';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost]), BlogModule],
  providers: [BlogPostService, BlogPostResolver],
})
export class BlogPostModule {}
