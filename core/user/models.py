import uuid
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.http import Http404
from core.abstract.models import AbstractManager, AbstractModel


def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return "user_{0}/{1}".format(instance.public_id, filename)


class UserManager(BaseUserManager, AbstractManager):
    def create_user(self, username, email, password=None, **kwargs):
        if username is None:
            raise TypeError("Users must have a username.")
        if email is None:
            raise TypeError("Users must have an email.")
        if password is None:
            raise TypeError("User must have an email.")

        user = self.model(
            username=username, email=self.normalize_email(email), **kwargs
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password, **kwargs):
        if password is None:
            raise TypeError("Superusers must have a password.")
        if email is None:
            raise TypeError("Superusers must have an email.")
        if username is None:
            raise TypeError("Superusers must have an username.")
        user = self.create_user(username, email, password, **kwargs)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user


class User(AbstractModel, AbstractBaseUser, PermissionsMixin):
    username = models.CharField(db_index=True, max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(db_index=True, unique=True)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    posts_liked = models.ManyToManyField("core_post.Post", related_name="liked_by")
    comments_liked = models.ManyToManyField(
        "core_comment.Comment", related_name="liked_by"
    )
    bio = models.TextField(null=True)
    avatar = models.ImageField(null=True, blank=True, upload_to=user_directory_path)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    objects = UserManager()

    def like(self, post):
        return self.posts_liked.add(post)

    def remove_like(self, post):
        return self.posts_liked.remove(post)

    def has_liked(self, post):
        return self.posts_liked.filter(pk=post.pk).exists()

    def like_comment(self, comment):
        return self.comments_liked.add(comment)

    def remove_like_comment(self, comment):
        return self.comments_liked.remove(comment)

    def has_liked_comment(self, comment):
        return self.comments_liked.filter(pk=comment.pk).exists()

    @property
    def name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return self.email
