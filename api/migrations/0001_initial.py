# Generated by Django 4.1 on 2022-08-28 08:35

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Recipients',
            fields=[
                ('rid', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(default=None, max_length=50)),
                ('email', models.CharField(default=None, max_length=50)),
                ('department', models.CharField(default=None, max_length=50)),
            ],
        ),
    ]
