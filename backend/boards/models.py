from django.db import models
from django.contrib.auth.models import User

class Board(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

class Column(models.Model):
    name = models.CharField(max_length=100)
    board = models.ForeignKey(Board, related_name='columns', on_delete=models.CASCADE)
    order = models.IntegerField()

class Card(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    column = models.ForeignKey(Column, related_name='cards', on_delete=models.CASCADE)
    order = models.IntegerField()
    assigned_to = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
